"use client";

import { motion } from "framer-motion";

export default function AnimatedUnderline({
  color = "#F2B705",
}: {
  color?: "#F2B705" | "#FF5C7A" | "#2DD4BF" | string;
}) {
  return (
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      style={{ backgroundColor: color, transformOrigin: "left" }}
      className="mx-auto mt-3 block h-[3px] w-16 rounded-full"
    />
  );
}
