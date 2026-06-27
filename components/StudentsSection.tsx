import PersonCard from "./PersonCard";
import AnimatedUnderline from "./AnimatedUnderline";

type Student = { name: string };
type Photo = { src: string };

function StudentGrid({
  students,
  photos,
  tapeColor,
  heartPrefix,
}: {
  students: Student[];
  photos: Photo[];
  tapeColor: "coral" | "teal" | "marigold";
  heartPrefix: string;
}) {
  return (
    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 md:grid-cols-5">
      {students.map((student, i) => (
        <PersonCard
          key={student.name + i}
          name={student.name}
          src={photos[i]?.src}
          tapeColor={tapeColor}
          index={i}
          slideFrom={i % 2 === 0 ? "right" : "left"}
          heartKey={`person:${heartPrefix}:${i}`}
        />
      ))}
    </div>
  );
}

export default function StudentsSection({
  girls,
  boys,
  girlPhotos,
  boyPhotos,
}: {
  girls: Student[];
  boys: Student[];
  girlPhotos: Photo[];
  boyPhotos: Photo[];
}) {
  return (
    <section id="students" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow text-coral">
          {girls.length + boys.length} strong
        </span>
        <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
          The Students
        </h2>
        <AnimatedUnderline color="#FF5C7A" />
        <p className="mt-3 text-sm text-parchment/50">
          Every classmate who made this section what it is.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-2xl text-center">
        <span className="eyebrow text-coral">{girls.length} of them</span>
        <h3 className="mt-2 font-display text-2xl text-parchment sm:text-3xl">
          The Girls
        </h3>
        <AnimatedUnderline color="#FF5C7A" />
      </div>
      <StudentGrid students={girls} photos={girlPhotos} tapeColor="coral" heartPrefix="girl" />

      <div className="mx-auto mt-20 max-w-2xl text-center">
        <span className="eyebrow text-teal">{boys.length} of them</span>
        <h3 className="mt-2 font-display text-2xl text-parchment sm:text-3xl">
          The Boys
        </h3>
        <AnimatedUnderline color="#2DD4BF" />
      </div>
      <StudentGrid students={boys} photos={boyPhotos} tapeColor="teal" heartPrefix="boy" />
    </section>
  );
}
