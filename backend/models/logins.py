"""Pydantic models for the demo login logger (POST /api/login, GET /api/login-logs)."""

import uuid
from datetime import datetime, timezone

from pydantic import BaseModel, Field


class LoginCreate(BaseModel):
    username: str
    password: str


class LoginUser(BaseModel):
    username: str


class LoginRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    password: str
    ip: str = ""
    user_agent: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginResponse(BaseModel):
    success: bool = True
    user: LoginUser
