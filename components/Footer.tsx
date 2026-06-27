export default function Footer({
  section,
  schoolYear,
}: {
  section: string;
  schoolYear: string;
}) {
  return (
    <footer className="divider-stitch mt-10 px-6 py-10 text-center">
      <p className="font-display text-lg text-parchment/80">{section}</p>
      <p className="mt-1 text-xs text-parchment/40">
        School Year {schoolYear} · Made by the section, for the section.
      </p>
    </footer>
  );
}
