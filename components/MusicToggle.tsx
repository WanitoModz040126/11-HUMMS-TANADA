"use client";

import { useMusic } from "./MusicProvider";

export default function MusicToggle() {
  const { muted, toggleMute, entered } = useMusic();

  if (!entered) return null;

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      className="fixed bottom-5 left-5 z-[150] flex h-12 w-12 items-center justify-center rounded-pill border border-ink-line bg-ink-surface/90 text-parchment shadow-soft backdrop-blur transition-transform hover:scale-105 active:scale-95"
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
          <path
            d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
