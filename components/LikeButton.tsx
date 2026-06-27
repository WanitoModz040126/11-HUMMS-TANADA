"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVisitorId } from "@/lib/visitorId";

const LIKED_KEY = "humss-tanada-has-liked";

export default function LikeButton() {
  const [total, setTotal] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(LIKED_KEY) === "1");
    fetch("/api/like")
      .then((res) => res.json())
      .then((data) => setTotal(data.total ?? 0))
      .catch(() => setError(true));
  }, []);

  const handleClick = async () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 450);

    if (liked) return; // already counted from this browser

    try {
      const visitorId = getVisitorId();
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setTotal(data.total ?? 0);
      setLiked(true);
      localStorage.setItem(LIKED_KEY, "1");
    } catch {
      setError(true);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: "spring" }}
      className="fixed bottom-5 right-5 z-[150] flex items-center gap-2 rounded-pill border border-ink-line bg-ink-surface/90 px-5 py-3 shadow-soft backdrop-blur transition-transform hover:scale-105 active:scale-95"
      aria-label="Like this page"
    >
      <span className={bounce ? "animate-heartpop" : ""}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={liked ? "#FF5C7A" : "none"}
          stroke={liked ? "#FF5C7A" : "#F5F2E9"}
          strokeWidth="2"
        >
          <path d="M12 21s-7.5-4.6-10-9.3C0.3 8.4 1.8 4.8 5.3 4c2.1-.5 4.2.4 5.3 2.2C11.7 4.4 13.8 3.5 15.9 4c3.5.8 5 4.4 3.3 7.7C19.5 16.4 12 21 12 21z" />
        </svg>
      </span>
      <span className="font-body text-sm font-semibold text-parchment">
        {error ? "—" : total === null ? "…" : total}
      </span>
    </motion.button>
  );
}
