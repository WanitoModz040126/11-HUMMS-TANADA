function RibbonContent({ section, schoolYear }: { section: string; schoolYear: string }) {
  const text = `S.Y. ${schoolYear}  ✦  ${section}  ✦  ONE SECTION, ONE STORY  ✦  `;
  return (
    <span className="mx-4 inline-block font-display text-sm tracking-wide text-ink-deep">
      {text}
    </span>
  );
}

export default function RibbonMarquee({
  section,
  schoolYear,
}: {
  section: string;
  schoolYear: string;
}) {
  return (
    <div className="relative -rotate-1 overflow-hidden border-y border-marigold/30 bg-gradient-to-r from-marigold via-coral to-teal py-2.5">
      <div className="ribbon-track flex w-max items-center whitespace-nowrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <RibbonContent key={i} section={section} schoolYear={schoolYear} />
        ))}
      </div>

      <style>{`
        .ribbon-track {
          animation: ribbon-scroll 26s linear infinite;
        }
        @keyframes ribbon-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ribbon-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
