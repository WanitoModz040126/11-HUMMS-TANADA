"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import HeartButton from "./HeartButton";

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

type Props = {
  name: string;
  sublabel?: string;
  src?: string;
  tapeColor: "marigold" | "coral" | "teal";
  index?: number;
  size?: "lg" | "md";
  slideFrom?: "up" | "left" | "right";
  heartKey?: string;
};

const TAPE_HEX: Record<Props["tapeColor"], string> = {
  marigold: "#F2B705",
  coral: "#FF5C7A",
  teal: "#2DD4BF",
};

const SLIDE_OFFSET: Record<NonNullable<Props["slideFrom"]>, { x: number; y: number }> = {
  up: { x: 0, y: 26 },
  left: { x: -36, y: 10 },
  right: { x: 36, y: 10 },
};

export default function PersonCard({
  name,
  sublabel,
  src,
  tapeColor,
  index = 0,
  size = "md",
  slideFrom = "up",
  heartKey,
}: Props) {
  const [broken, setBroken] = useState(!src);
  const tilt = (index % 5) - 2; // small varied rotation, -2..2 deg
  const offset = SLIDE_OFFSET[slideFrom];
  const displayName = name || "Unnamed";

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.45), ease: "easeOut" }}
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
      className="tape-corner group relative flex flex-col items-center rounded-card border border-ink-line bg-ink-surface p-4 shadow-soft transition-transform duration-300"
    >
      <style jsx>{`
        .tape-corner {
          --tape-color: ${TAPE_HEX[tapeColor]};
          transform: rotate(var(--tilt));
        }
        .tape-corner:hover {
          transform: rotate(0deg) translateY(-6px);
        }
      `}</style>

      {heartKey && (
        <div className="absolute right-2 top-2 z-10">
          <HeartButton storageKey={heartKey} size="sm" />
        </div>
      )}

      <div
        className={`relative overflow-hidden rounded-2xl bg-ink-surface2 ${
          size === "lg" ? "h-40 w-40" : "h-28 w-28"
        }`}
      >
        {!broken && src ? (
          <img
            src={src}
            alt={displayName}
            className="h-full w-full object-cover"
            draggable={false}
            onError={() => setBroken(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-2xl text-ink-deep"
            style={{ backgroundColor: TAPE_HEX[tapeColor] }}
          >
            {initials(name)}
          </div>
        )}
      </div>

      <p className="mt-3 text-center font-body text-sm font-semibold text-parchment">
        {displayName}
      </p>
      {sublabel && (
        <p className="eyebrow mt-1 text-center text-[10px] text-parchment/50">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}

