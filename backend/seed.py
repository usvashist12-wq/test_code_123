"""Idempotent seed for the demo feed — run: cd /app/backend && python seed.py."""

import asyncio
from datetime import datetime, timezone

from lib.db import db, ensure_indexes

POSTS = [
    {
        "id": "post-1",
        "username": "elena_wander",
        "user_avatar": "https://images.unsplash.com/photo-1607960402186-3ab215688ebf?crop=entropy&cs=srgb&fm=jpg&q=85",
        "post_image": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=srgb&fm=jpg&q=85",
        "caption": "Golden hours with the ones who make life luminous ✨💛 #sunsetvibes #closefriends",
        "likes": 1284,
        "time": "2 hours ago",
    },
    {
        "id": "post-2",
        "username": "alex_adventures",
        "user_avatar": "https://images.unsplash.com/photo-1616432119481-2876a5d92249?crop=entropy&cs=srgb&fm=jpg&q=85",
        "post_image": "https://images.unsplash.com/photo-1690531611148-8a54db2fdcad?crop=entropy&cs=srgb&fm=jpg&q=85",
        "caption": "Cobblestone alleys and endless coffee runs ☕️ Loving every second here.",
        "likes": 3491,
        "time": "5 hours ago",
    },
    {
        "id": "post-3",
        "username": "maya_creates",
        "user_avatar": "https://images.unsplash.com/photo-1772723246436-ce9c917b3ba7?crop=entropy&cs=srgb&fm=jpg&q=85",
        "post_image": "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?crop=entropy&cs=srgb&fm=jpg&q=85",
        "caption": "Midday laughter that heals the soul. Never taking these weekends for granted.",
        "likes": 842,
        "time": "1 day ago",
    },
]


async def seed() -> None:
    for post in POSTS:
        # created_at only on insert, so re-running never reorders the feed
        await db.posts.update_one(
            {"id": post["id"]},
            {"$set": post, "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
            upsert=True,
        )
    await ensure_indexes()


if __name__ == "__main__":
    asyncio.run(seed())
    print(f"seeded {len(POSTS)} demo posts")
