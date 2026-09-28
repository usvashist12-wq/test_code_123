import { useId } from "react";

/** Instagram camera glyph, stroked with the brand gradient. */
export function InstagramGlyph({ size = 44, className }: { size?: number; className?: string }) {
  const rawId = useId();
  const gradId = `ig-glyph-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="0.28" cy="1.1" r="1.35">
          <stop offset="0%" stopColor="#FFD776" />
          <stop offset="26%" stopColor="#F56040" />
          <stop offset="56%" stopColor="#E1306C" />
          <stop offset="82%" stopColor="#A02BB4" />
          <stop offset="100%" stopColor="#5B51D8" />
        </radialGradient>
      </defs>
      <rect x="3.5" y="3.5" width="41" height="41" rx="12.5" stroke={`url(#${gradId})`} strokeWidth="5" />
      <circle cx="24" cy="24" r="9.5" stroke={`url(#${gradId})`} strokeWidth="5" />
      <circle cx="35.4" cy="12.6" r="3" fill={`url(#${gradId})`} />
    </svg>
  );
}

/** Meta wordmark: infinity mark + text. */
export function MetaWordmark({ className = "" }: { className?: string }) {
  return (
    <span data-testid="meta-logo" className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width="22" height="15" viewBox="0 0 36 22" fill="none" aria-hidden="true">
        <path
          d="M9.5 4C4 4 4 18 9.5 18C15 18 21 4 26.5 4C32 4 32 18 26.5 18C21 18 15 4 9.5 4Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight">Meta</span>
    </span>
  );
}
