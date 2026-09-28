# SPEC — Instagram login clone (demo)

## What the app is
Pixel-faithful dark-theme clone of the Instagram login page (per the user's screenshot),
plus a demo login flow and a mock feed. NOT connected to instagram.com in any way —
the form is a demo; it stores what the visitor types via the app's own backend.

## Flows
1. `/` — login page. Left hero: gradient IG glyph, "See everyday moments from your
   close friends." headline (gradient on "close friends."), story-card collage with
   stickers (emoji pill, green close-friends star, gradient heart, avatar bubble).
   Right panel (#121212): "Log into Instagram", username + password inputs (blue focus
   ring, eye toggle), Log in button, Forgot password?, Log in with Facebook, Create new
   account, Meta wordmark, and a subtle "Demo: view captured logins" dialog that lists
   everything POST /api/login has saved (GET /api/login-logs). Full Meta footer.
2. Demo login: ANY username/password → POST /api/login → username stored in
   localStorage `ig_user` → navigate to `/feed`.
3. `/feed` — mock Instagram web feed (dark): sidebar nav (only Home is real; other
   items toast "demo item"), stories tray with gradient rings + story viewer dialog,
   posts from GET /api/posts with client-side like toggle (red heart, +1) and local
   comment add, right rail with current user + Follow toggles, Log out (clears
   localStorage, back to `/`). If the backend is unreachable the shell still renders
   with a skeleton/error state — never a blank page.

## Data model (Mongo, db "app"; string uuid ids, no ObjectId)
- `login_logs`: LoginRecord { id, username, password, ip, user_agent, created_at }
  — also appended to local file `backend/data/login_logs.json` (plaintext; demo only).
- `posts`: Post { id, username, user_avatar, post_image, caption, likes, time }
  — 3 posts seeded by `backend/seed.py` (idempotent, $setOnInsert created_at).

## API (all under /api on api_router)
- POST /api/login {username,password} → { success, user:{username} } (no validation — demo)
- GET /api/login-logs → LoginRecord[] (newest first)
- GET /api/posts → Post[] (seed order)
- GET /api/status, POST /api/status — template leftovers, unused by the UI

## Auth
None. No sessions, no accounts: any credentials pass. Passwords saved in plaintext
by explicit user request (local demo). `memory/test_credentials.md` has details.

## Notes
- Dark-by-default via `<html class="dark">`; font: Plus Jakarta Sans Variable.
- Frontend↔backend interfaces mirrored by hand in `frontend/src/lib/types.ts`.
- Re-seed anytime: `cd /app/backend && python seed.py`.
