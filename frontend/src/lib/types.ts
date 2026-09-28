// Hand-written mirrors of the backend Pydantic models — nothing infers across the
// HTTP boundary, so keep these in sync with backend/models/*.py in the same edit.

// backend/models/logins.py — LoginCreate
export interface LoginRequest {
  username: string;
  password: string;
}

// backend/models/logins.py — LoginResponse
export interface LoginResponse {
  success: boolean;
  user: { username: string };
}

// backend/models/logins.py — LoginRecord
export interface LoginRecord {
  id: string;
  username: string;
  password: string;
  ip: string;
  user_agent: string;
  created_at: string;
}

// backend/models/posts.py — Post
export interface Post {
  id: string;
  username: string;
  user_avatar: string;
  post_image: string;
  caption: string;
  likes: number;
  time: string;
}
