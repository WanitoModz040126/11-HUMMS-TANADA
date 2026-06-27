"use client";

import { motion } from "framer-motion";
import HeartButton from "./HeartButton";
import AnimatedUnderline from "./AnimatedUnderline";

export default function QueenSection({
  name,
  title,
  photoSrc,
}: {
  name: string;
  title: string;
  photoSrc?: string;
}) {
  return (
    <section id="queen" className="relative px-6 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-marigold">Crowned by the section</span>
        <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
          Queen of the Room
        </h2>
        <AnimatedUnderline color="#F2B705" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto mt-12 flex max-w-xs flex-col items-center"
      >
        <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-pill bg-gradient-to-r from-marigold via-coral to-marigold px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-deep shadow-glow">
          ✦ Queen of the Room ✦
        </div>

        <div className="relative w-full rounded-card border-2 border-marigold/40 bg-ink-surface p-6 shadow-glow">
          <div className="absolute right-3 top-3 z-10">
            <HeartButton storageKey="person:queen:0" />
          </div>

          <div className="mx-auto h-44 w-44 overflow-hidden rounded-2xl bg-ink-surface2 shadow-soft">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt={name}
                className="h-full w-full object-cover"
                draggable={false}
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-marigold font-display text-3xl text-ink-deep">
                ♛
              </div>
            )}
          </div>

          <p className="mt-4 text-center font-display text-xl text-parchment">{name}</p>
          <p className="eyebrow mt-1 text-center text-marigold">{title}</p>
        </div>
      </motion.div>
    </section>
  );
}
