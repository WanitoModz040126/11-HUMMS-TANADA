"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useHearts } from "./HeartsProvider";

type Props = {
  /** Unique, stable key for the thing being hearted, e.g. "person:officer:0" or "gallery:14.png" */
  storageKey: string;
  size?: "sm" | "md";
  className?: string;
  /** Show the running total next to the heart, like a reaction count. Default true. */
  showCount?: boolean;
};

export default function HeartButton({
  storageKey,
  size = "md",
  className = "",
  showCount = true,
}: Props) {
  const { isHearted, toggleHeart, getCount, registerKeys } = useHearts();
  const [bounce, setBounce] = useState(false);
  const hearted = isHearted(storageKey);
  const count = getCount(storageKey);
  const dimension = size === "sm" ? 16 : 20;

  useEffect(() => {
    registerKeys([storageKey]);
  }, [storageKey, registerKeys]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleHeart(storageKey);
        setBounce(true);
        setTimeout(() => setBounce(false), 450);
      }}
      aria-pressed={hearted}
      aria-label={hearted ? "Remove heart" : "Give a heart"}
      className={`flex items-center gap-1.5 rounded-pill border border-ink-line bg-ink-deep/70 shadow-soft backdrop-blur transition-transform hover:scale-110 active:scale-95 ${
        size === "sm" ? "h-7 px-2" : "h-9 px-3"
      } ${className}`}
    >
      <motion.svg
        animate={bounce ? { scale: [1, 1.4, 0.92, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill={hearted ? "#FF5C7A" : "none"}
        stroke={hearted ? "#FF5C7A" : "#F5F2E9"}
        strokeWidth="2"
      >
        <path d="M12 21s-7.5-4.6-10-9.3C0.3 8.4 1.8 4.8 5.3 4c2.1-.5 4.2.4 5.3 2.2C11.7 4.4 13.8 3.5 15.9 4c3.5.8 5 4.4 3.3 7.7C19.5 16.4 12 21 12 21z" />
      </motion.svg>
      {showCount && (
        <span
          className={`font-body font-semibold text-parchment ${
            size === "sm" ? "text-[11px]" : "text-xs"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
