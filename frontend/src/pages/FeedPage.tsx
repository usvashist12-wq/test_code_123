import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Bookmark,
  Clapperboard,
  Compass,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  SquarePlus,
} from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Post } from "@/lib/types";
import { InstagramGlyph } from "@/components/Brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AVATARS = {
  elena: "https://images.unsplash.com/photo-1607960402186-3ab215688ebf?crop=entropy&cs=srgb&fm=jpg&q=85",
  maya: "https://images.unsplash.com/photo-1772723246436-ce9c917b3ba7?crop=entropy&cs=srgb&fm=jpg&q=85",
  leo: "https://images.unsplash.com/photo-1608229321710-1caa06bc5269?crop=entropy&cs=srgb&fm=jpg&q=85",
  alex: "https://images.unsplash.com/photo-1616432119481-2876a5d92249?crop=entropy&cs=srgb&fm=jpg&q=85",
  sam: "https://images.unsplash.com/photo-1762708551725-adf8e867e659?crop=entropy&cs=srgb&fm=jpg&q=85",
  noor: "https://images.unsplash.com/photo-1619011940610-eda7c2ab3477?crop=entropy&cs=srgb&fm=jpg&q=85",
};

interface StoryUser {
  username: string;
  avatar: string;
  label: string;
  isSelf?: boolean;
}

const STORY_OTHERS: StoryUser[] = [
  { username: "elena_wander", avatar: AVATARS.elena, label: "elena_wander" },
  { username: "alex_adventures", avatar: AVATARS.alex, label: "alex_adventures" },
  { username: "maya_creates", avatar: AVATARS.maya, label: "maya_creates" },
  { username: "leo_frames", avatar: AVATARS.leo, label: "leo_frames" },
  { username: "sam_route", avatar: AVATARS.sam, label: "sam_route" },
  { username: "noor_parks", avatar: AVATARS.noor, label: "noor_parks" },
];

const SUGGESTIONS = [
  { username: "sam_route", avatar: AVATARS.sam, reason: "Suggested for you" },
  { username: "noor_parks", avatar: AVATARS.noor, reason: "Followed by elena_wander" },
  { username: "leo_frames", avatar: AVATARS.leo, reason: "Suggested for you" },
  { username: "elena_wander", avatar: AVATARS.elena, reason: "Followed by maya_creates" },
  { username: "maya_creates", avatar: AVATARS.maya, reason: "Suggested for you" },
];

const NAV_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search", active: false },
  { icon: Compass, label: "Explore", active: false },
  { icon: Clapperboard, label: "Reels", active: false },
  { icon: MessageCircle, label: "Messages", active: false },
  { icon: Heart, label: "Notifications", active: false },
  { icon: SquarePlus, label: "Create", active: false },
];

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function PostCard({
  post,
  liked,
  likes,
  comments,
  draft,
  onToggleLike,
  onDraftChange,
  onAddComment,
}: {
  post: Post;
  liked: boolean;
  likes: number;
  comments: { username: string; text: string }[];
  draft: string;
  onToggleLike: (postId: string) => void;
  onDraftChange: (postId: string, text: string) => void;
  onAddComment: (postId: string) => void;
}) {
  const id = post.id;
  return (
    <article
      data-testid={`feed-post-item-${id}`}
      data-post-id={id}
      className="mb-6 border-b border-[#262626] pb-4 last:border-b-0"
    >
      <header className="flex items-center gap-3 py-3">
        <span className="rounded-full bg-[conic-gradient(from_0deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5,#FEDA75)] p-[2px]">
          <img
            src={post.user_avatar}
            alt={`${post.username} avatar`}
            className="h-8 w-8 rounded-full border-2 border-black object-cover"
          />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold" data-testid={`post-username-${id}`}>
            {post.username}
          </p>
          <p className="text-xs text-[#A8A8A8]" data-testid={`post-time-${id}`}>
            {post.time}
          </p>
        </div>
        <button
          className="ml-auto text-[#A8A8A8] transition-colors hover:text-white"
          aria-label="More options"
          data-testid={`post-more-button-${id}`}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      <img
        data-testid={`post-image-${id}`}
        src={post.post_image}
        alt={`Post by ${post.username}`}
        className="aspect-square w-full rounded-lg object-cover"
      />

      <div className="mt-3 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 1.2 }}
          data-testid={`post-like-button-${id}`}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={() => onToggleLike(id)}
          className="transition-colors"
        >
          <Heart
            className={`h-6 w-6 transition-colors ${liked ? "fill-[#FF3040] text-[#FF3040]" : "text-white"}`}
          />
        </motion.button>
        <button
          aria-label="Comment"
          data-testid={`post-comment-button-${id}`}
          className="transition-colors hover:text-[#A8A8A8]"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        <button
          aria-label="Share"
          data-testid={`post-share-button-${id}`}
          className="transition-colors hover:text-[#A8A8A8]"
        >
          <Send className="h-6 w-6" />
        </button>
        <button
          aria-label="Save"
          data-testid={`post-save-button-${id}`}
          className="ml-auto transition-colors hover:text-[#A8A8A8]"
        >
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      <p className="mt-2 text-sm font-semibold" data-testid={`post-likes-count-${id}`}>
        {likes.toLocaleString("en-US")} likes
      </p>
      <p className="mt-1 text-sm" data-testid={`post-caption-${id}`}>
        <span className="mr-2 font-semibold">{post.username}</span>
        {post.caption}
      </p>
      {comments.map((c, i) => (
        <p key={i} className="mt-1 text-sm" data-testid={`post-comment-${id}-${i}`}>
          <span className="mr-2 font-semibold">{c.username}</span>
          {c.text}
        </p>
      ))}

      <form
        className="mt-3 flex items-center gap-2 border-t border-[#262626] pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onAddComment(id);
        }}
        data-testid={`post-comment-form-${id}`}
      >
        <Input
          value={draft}
          onChange={(e) => onDraftChange(id, e.target.value)}
          placeholder="Add a comment..."
          data-testid={`post-comment-input-${id}`}
          className="h-9 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
        />
        <Button
          type="submit"
          variant="ghost"
          disabled={!draft.trim()}
          data-testid={`post-comment-submit-button-${id}`}
          className="text-sm font-semibold text-[#0095F6] hover:bg-transparent hover:text-white"
        >
          Post
        </Button>
      </form>
    </article>
  );
}

export default function FeedPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("ig_user") || "demo_user";
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, { username: string; text: string }[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [openStory, setOpenStory] = useState<StoryUser | null>(null);

  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => apiGet<Post[]>("/posts"),
    retry: false,
  });
  const posts = postsQuery.data ?? [];

  const stories: StoryUser[] = [
    { username: user, avatar: AVATARS.leo, label: "Your story", isSelf: true },
    ...STORY_OTHERS,
  ];

  const logout = () => {
    localStorage.removeItem("ig_user");
    navigate("/");
  };

  const toggleLike = (postId: string) => setLiked((prev) => ({ ...prev, [postId]: !prev[postId] }));
  const toggleFollow = (username: string) =>
    setFollowing((prev) => ({ ...prev, [username]: !prev[username] }));
  const changeDraft = (postId: string, text: string) =>
    setDrafts((prev) => ({ ...prev, [postId]: text }));
  const addComment = (postId: string) => {
    const text = (drafts[postId] ?? "").trim();
    if (!text) return;
    setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), { username: user, text }] }));
    changeDraft(postId, "");
  };

  const sidebarButton = (active: boolean) =>
    `flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-[15px] transition-colors hover:bg-[#1a1a1a] ${
      active ? "font-bold text-white" : "text-[#F5F5F5]"
    }`;

  return (
    <div className="flex min-h-svh bg-black text-white" data-testid="feed-page">
      {/* Desktop sidebar */}
      <aside
        className="sticky top-0 hidden h-svh w-[72px] shrink-0 flex-col border-r border-[#262626] bg-black px-3 py-6 md:flex xl:w-[244px]"
        data-testid="feed-sidebar"
      >
        <div className="mb-6 flex items-center gap-2 px-2">
          <InstagramGlyph size={34} />
          <span className="hidden text-2xl font-semibold tracking-tight xl:inline">Instagram</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1" data-testid="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              data-testid={`nav-${slug(item.label)}-item`}
              onClick={() => {
                if (!item.active) toast.info(`${item.label} is a demo item.`);
              }}
              className={sidebarButton(item.active)}
            >
              <item.icon className="h-6 w-6 shrink-0" strokeWidth={item.active ? 2.5 : 2} />
              <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            data-testid="nav-profile-item"
            onClick={() => toast.info("Profile is a demo item.")}
            className={sidebarButton(false)}
          >
            <img src={AVATARS.leo} alt="Your avatar" className="h-6 w-6 shrink-0 rounded-full object-cover" />
            <span className="hidden truncate xl:inline">{user}</span>
          </button>
          <div className="mt-auto">
            <button
              type="button"
              data-testid="nav-logout-button"
              onClick={logout}
              className={sidebarButton(false)}
            >
              <LogOut className="h-6 w-6 shrink-0" />
              <span className="hidden xl:inline">Log out</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-[#262626] bg-black px-4 py-3 md:hidden"
          data-testid="feed-mobile-header"
        >
          <div className="flex items-center gap-2">
            <InstagramGlyph size={30} />
            <span className="text-xl font-semibold">Instagram</span>
          </div>
          <button
            type="button"
            data-testid="nav-logout-button-mobile"
            onClick={logout}
            aria-label="Log out"
            className="text-[#F5F5F5] transition-colors hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="flex flex-1 justify-center gap-10 px-4">
          {/* Center column */}
          <main className="w-full max-w-[630px] py-8" data-testid="feed-container">
            {/* Stories tray */}
            <div className="mb-8 flex gap-4 overflow-x-auto pb-2" data-testid="story-tray">
              {stories.map((s) => (
                <button
                  key={s.username}
                  type="button"
                  data-testid={`story-tray-item-${slug(s.username)}`}
                  onClick={() => setOpenStory(s)}
                  className="flex w-16 shrink-0 flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative rounded-full p-[2.5px] ${
                      s.isSelf
                        ? "bg-[#262626]"
                        : "bg-[conic-gradient(from_0deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5,#FEDA75)]"
                    }`}
                  >
                    <img
                      src={s.avatar}
                      alt={`${s.username} story`}
                      className="h-14 w-14 rounded-full border-2 border-black object-cover"
                    />
                    {s.isSelf && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[#0095F6]">
                        <Plus className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <span className="w-16 truncate text-center text-xs text-[#F5F5F5]">{s.label}</span>
                </button>
              ))}
            </div>

            {postsQuery.isLoading && (
              <div className="space-y-6" data-testid="feed-loading">
                {[0, 1].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-[#262626]" />
                      <div className="h-4 w-32 animate-pulse rounded bg-[#262626]" />
                    </div>
                    <div className="aspect-square w-full animate-pulse rounded-lg bg-[#262626]" />
                  </div>
                ))}
              </div>
            )}

            {postsQuery.isError && (
              <div className="rounded-xl border border-[#262626] p-8 text-center" data-testid="feed-error">
                <p className="text-sm text-[#A8A8A8]">Couldn't load the feed right now.</p>
                <Button
                  variant="outline"
                  className="mt-4 border-[#363636] bg-transparent text-white hover:bg-[#1a1a1a] hover:text-white"
                  data-testid="feed-retry-button"
                  onClick={() => postsQuery.refetch()}
                >
                  Try again
                </Button>
              </div>
            )}

            {!postsQuery.isLoading && !postsQuery.isError && posts.length === 0 && (
              <p className="py-16 text-center text-sm text-[#A8A8A8]" data-testid="feed-empty">
                No posts yet.
              </p>
            )}

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                liked={!!liked[post.id]}
                likes={post.likes + (liked[post.id] ? 1 : 0)}
                comments={comments[post.id] ?? []}
                draft={drafts[post.id] ?? ""}
                onToggleLike={toggleLike}
                onDraftChange={changeDraft}
                onAddComment={addComment}
              />
            ))}
          </main>

          {/* Right rail */}
          <aside className="hidden w-[320px] shrink-0 pt-8 pr-4 xl:block" data-testid="suggestions-rail">
            <div className="flex items-center gap-3">
              <img src={AVATARS.leo} alt="Your avatar" className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" data-testid="current-username">
                  {user}
                </p>
                <p className="text-sm text-[#A8A8A8]">Demo account</p>
              </div>
              <button
                type="button"
                onClick={logout}
                data-testid="rail-switch-account"
                className="ml-auto shrink-0 text-xs font-semibold text-[#0095F6] transition-colors hover:text-white"
              >
                Switch
              </button>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#A8A8A8]">Suggested for you</p>
              <button
                type="button"
                data-testid="see-all-suggestions"
                className="text-xs font-semibold text-white hover:text-[#A8A8A8]"
              >
                See All
              </button>
            </div>
            <ul className="mt-4 space-y-3" data-testid="suggestions-list">
              {SUGGESTIONS.map((s) => (
                <li
                  key={s.username}
                  className="flex items-center gap-3"
                  data-testid={`suggested-user-item-${slug(s.username)}`}
                >
                  <img src={s.avatar} alt={`${s.username} avatar`} className="h-8 w-8 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.username}</p>
                    <p className="truncate text-xs text-[#A8A8A8]">{s.reason}</p>
                  </div>
                  <button
                    type="button"
                    data-testid={`follow-button-${slug(s.username)}`}
                    onClick={() => toggleFollow(s.username)}
                    className="ml-auto shrink-0 text-xs font-semibold text-[#0095F6] transition-colors hover:text-white"
                  >
                    {following[s.username] ? "Following" : "Follow"}
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-xs leading-5 text-[#4b4b4b]">
              Demo clone built with FastAPI + React. Logins submitted on the login page are saved by the
              backend.
            </p>
          </aside>
        </div>
      </div>

      {/* Story viewer */}
      <Dialog open={!!openStory} onOpenChange={(v) => !v && setOpenStory(null)}>
        <DialogContent className="max-w-sm border-none bg-[#1e1e1e] p-0" data-testid="story-viewer-dialog">
          {openStory && (
            <>
              <DialogHeader className="flex-row items-center gap-2 px-4 pt-4">
                <img src={openStory.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <DialogTitle className="text-sm" data-testid="story-viewer-username">
                  {openStory.username}
                </DialogTitle>
              </DialogHeader>
              <img
                src={openStory.avatar}
                alt={`${openStory.username} story`}
                className="aspect-square w-full object-cover"
                data-testid="story-viewer-image"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
