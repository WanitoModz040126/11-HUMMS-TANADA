import PersonCard from "./PersonCard";
import AnimatedUnderline from "./AnimatedUnderline";

export default function OfficersSection({
  officers,
  photos,
}: {
  officers: { position: string; name: string }[];
  photos: { src: string }[];
}) {
  return (
    <section id="officers" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-marigold">Leading the way</span>
        <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
          Class Officers
        </h2>
        <AnimatedUnderline color="#F2B705" />
        <p className="mt-3 text-sm text-parchment/50">
          The {officers.length} of them keeping our section organized all year.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 md:grid-cols-5">
        {officers.map((officer, i) => (
          <PersonCard
            key={officer.position + i}
            name={officer.name}
            sublabel={officer.position}
            src={photos[i]?.src}
            tapeColor="marigold"
            index={i}
            slideFrom={i % 2 === 0 ? "left" : "right"}
            heartKey={`person:officer:${i}`}
          />
        ))}
      </div>
    </section>
  );
}
