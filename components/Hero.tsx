"use client";

import { motion } from "framer-motion";

export default function Hero({
  section,
  schoolYear,
  motto,
  strand,
}: {
  section: string;
  schoolYear: string;
  motto: string;
  strand: string;
}) {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-marigold/10 blur-3xl animate-floaty" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-coral/10 blur-3xl animate-floaty" />
        <div className="absolute top-1/3 right-10 h-56 w-56 rounded-full bg-teal/10 blur-3xl animate-floaty" />
      </div>

      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="eyebrow rounded-pill border border-ink-line bg-ink-surface px-4 py-1.5 text-marigold"
      >
        S.Y. {schoolYear} · {strand}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-6 max-w-3xl font-display text-5xl leading-tight text-parchment sm:text-6xl"
      >
        {section}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.22 }}
        className="mt-5 max-w-xl text-base text-parchment/60"
      >
        {motto}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
      >
        {[
          { href: "#adviser", label: "Adviser" },
          { href: "#officers", label: "Officers" },
          { href: "#students", label: "Students" },
          { href: "#queen", label: "Queen of the Room" },
          { href: "#palaban", label: "Palaban na Pinay" },
          { href: "#gallery", label: "Gallery" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-pill border border-ink-line bg-ink-surface px-4 py-2 text-xs font-semibold text-parchment/80 transition-colors hover:border-marigold/50 hover:text-marigold"
          >
            {link.label}
          </a>
        ))}
      </motion.div>
    </section>
  );
}
