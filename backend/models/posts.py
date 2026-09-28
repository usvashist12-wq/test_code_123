"""Pydantic model for the demo feed (GET /api/posts)."""

from pydantic import BaseModel


class Post(BaseModel):
    id: str
    username: str
    user_avatar: str
    post_image: str
    caption: str
    likes: int
    time: str
