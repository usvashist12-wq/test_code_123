"""Demo feed posts — GET /api/posts lists the seeded mock feed (see seed.py)."""

from datetime import datetime, timezone

from fastapi import APIRouter

from lib.db import db
from models.posts import Post

router = APIRouter()


def _aware_utc(dt: datetime) -> datetime:
    """Motor hands back naive datetimes — normalise to aware UTC on read."""
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


@router.get("/posts", response_model=list[Post])
async def list_posts():
    docs = await db.posts.find().sort("created_at", 1).to_list(100)
    return [Post(**doc) for doc in docs]
