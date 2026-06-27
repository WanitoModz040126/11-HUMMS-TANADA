import PersonCard from "./PersonCard";
import AnimatedUnderline from "./AnimatedUnderline";

export default function AdviserSection({
  adviser,
  photoSrc,
}: {
  adviser: { name: string; title: string };
  photoSrc?: string;
}) {
  return (
    <section id="adviser" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-teal">Guiding the section</span>
        <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
          Our Class Adviser
        </h2>
        <AnimatedUnderline color="#2DD4BF" />
      </div>

      <div className="mx-auto mt-10 flex max-w-xs justify-center">
        <PersonCard
          name={adviser.name}
          sublabel={adviser.title}
          src={photoSrc}
          tapeColor="teal"
          size="lg"
          heartKey="person:adviser:0"
        />
      </div>
    </section>
  );
}
