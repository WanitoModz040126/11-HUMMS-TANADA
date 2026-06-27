"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "./MusicProvider";

export default function EntryGate({
  section,
  schoolYear,
}: {
  section: string;
  schoolYear: string;
}) {
  const { entered, enterAndPlay } = useMusic();

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink-deep px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-marigold/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
          </div>

          <motion.div
            className="relative flex max-w-md flex-col items-center text-center"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="eyebrow text-marigold">S.Y. {schoolYear}</span>
            <h1 className="mt-4 font-display text-4xl text-parchment sm:text-5xl">
              {section}
            </h1>
            <p className="mt-3 text-sm text-parchment/60">
              A page for our class, our memories, and our year together.
            </p>

            <button
              onClick={enterAndPlay}
              className="mt-9 rounded-pill bg-marigold px-8 py-3 font-body text-sm font-semibold text-ink-deep shadow-glow transition-transform hover:scale-105 active:scale-95"
            >
              Open the page
            </button>
            <p className="mt-3 text-xs text-parchment/40">
              Turns on background music · tap anywhere to begin
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
