"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "./MusicProvider";
import AnimatedUnderline from "./AnimatedUnderline";
import HeartButton from "./HeartButton";

type GalleryEntry = { file: string; src: string; type: string };

const TAPE = ["#F2B705", "#FF5C7A", "#2DD4BF"];

function Thumb({ entry, onOpen }: { entry: GalleryEntry; onOpen: () => void }) {
  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-card border border-ink-line bg-ink-surface2 shadow-soft">
      <button
        onClick={onOpen}
        className="absolute inset-0 z-0 block h-full w-full text-left"
        aria-label={`Open ${entry.file}`}
      >
        {entry.type === "image" ? (
          <img
            src={entry.src}
            alt={entry.file}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <video
              className="gallery-video h-full w-full object-cover"
              src={entry.src}
              muted
              preload="metadata"
              playsInline
              disablePictureInPicture
              controlsList="nodownload noremoteplayback"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink-deep/30 transition-colors group-hover:bg-ink-deep/45">
              <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-parchment/90 shadow-soft transition-transform group-hover:scale-110">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B0F1A">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </>
        )}
      </button>

      <div className="absolute right-2 top-2 z-10">
        <HeartButton storageKey={`gallery:${entry.file}`} size="sm" />
      </div>
    </div>
  );
}

const PAGE_SIZE = 60;

export default function GallerySection({ items }: { items: GalleryEntry[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { duckForVideo, restoreAfterVideo } = useMusic();

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const close = () => {
    restoreAfterVideo();
    setActiveIndex(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i === null ? i : Math.min(i + 1, visibleItems.length - 1)));
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    if (activeIndex !== null) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, visibleItems.length]);

  if (items.length === 0) {
    return (
      <section id="gallery" className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-teal">Memory wall</span>
          <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">Gallery</h2>
          <p className="mt-4 text-sm text-parchment/50">
            No photos yet. Drop files into <code>public/assets</code> (e.g. 1.png, 2.png,
            3.mp4) and redeploy — they will appear here automatically.
          </p>
        </div>
      </section>
    );
  }

  const active = activeIndex !== null ? visibleItems[activeIndex] : null;

  return (
    <section id="gallery" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-teal">Memory wall</span>
        <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">Gallery</h2>
        <AnimatedUnderline color="#2DD4BF" />
        <p className="mt-3 text-sm text-parchment/50">
          {items.length} memor{items.length === 1 ? "y" : "ies"} from the school year.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {visibleItems.map((entry, i) => (
          <motion.div
            key={entry.file}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
          >
            <Thumb
              entry={entry}
              onOpen={() => {
                setActiveIndex(i);
                if (entry.type === "video") duckForVideo();
              }}
            />
          </motion.div>
        ))}
      </div>

      {visibleCount < items.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, items.length))}
            className="rounded-pill border border-ink-line bg-ink-surface px-6 py-3 text-sm font-semibold text-parchment/80 shadow-soft transition-colors hover:border-teal/50 hover:text-teal"
          >
            Load more ({items.length - visibleCount} left)
          </button>
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-ink-deep/90 p-4 backdrop-blur"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[85vh] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rounded-sm opacity-90"
                style={{ background: TAPE[(activeIndex ?? 0) % 3] }}
              />
              {active.type === "image" ? (
                <img
                  src={active.src}
                  alt={active.file}
                  draggable={false}
                  className="max-h-[85vh] rounded-card border border-ink-line object-contain shadow-soft"
                />
              ) : (
                <video
                  src={active.src}
                  controls
                  autoPlay
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload noremoteplayback"
                  className="max-h-[85vh] rounded-card border border-ink-line shadow-soft"
                  onEnded={restoreAfterVideo}
                  onPause={restoreAfterVideo}
                  onPlay={duckForVideo}
                />
              )}

              <button
                onClick={close}
                aria-label="Close"
                className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-pill bg-parchment text-ink-deep shadow-soft"
              >
                ✕
              </button>

              <div className="absolute -left-3 -top-3 z-10">
                <HeartButton storageKey={`gallery:${active.file}`} />
              </div>

              <div className="absolute inset-y-0 -left-12 hidden items-center sm:flex">
                <button
                  aria-label="Previous"
                  onClick={() => setActiveIndex((i) => (i === null ? i : Math.max(i - 1, 0)))}
                  className="flex h-10 w-10 items-center justify-center rounded-pill border border-ink-line bg-ink-surface text-parchment"
                >
                  ‹
                </button>
              </div>
              <div className="absolute inset-y-0 -right-12 hidden items-center sm:flex">
                <button
                  aria-label="Next"
                  onClick={() =>
                    setActiveIndex((i) => (i === null ? i : Math.min(i + 1, visibleItems.length - 1)))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-pill border border-ink-line bg-ink-surface text-parchment"
                >
                  ›
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
