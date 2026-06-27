import members from "@/data/members.json";
import manifest from "@/lib/manifest";
import Hero from "@/components/Hero";
import EntryGate from "@/components/EntryGate";
import RibbonMarquee from "@/components/RibbonMarquee";
import AdviserSection from "@/components/AdviserSection";
import OfficersSection from "@/components/OfficersSection";
import StudentsSection from "@/components/StudentsSection";
import QueenSection from "@/components/QueenSection";
import PalabanSection from "@/components/PalabanSection";
import GallerySection from "@/components/GallerySection";
import LikeButton from "@/components/LikeButton";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <EntryGate section={members.section} schoolYear={members.schoolYear} />

      <Hero
        section={members.section}
        schoolYear={members.schoolYear}
        motto={members.motto}
        strand={members.strand}
      />

      <RibbonMarquee section={members.section} schoolYear={members.schoolYear} />

      <AdviserSection adviser={members.adviser} photoSrc={manifest.adviser[0]?.src} />

      <OfficersSection officers={members.officers} photos={manifest.officer} />

      <StudentsSection
        girls={members.girls}
        boys={members.boys}
        girlPhotos={manifest.girl}
        boyPhotos={manifest.boy}
      />

      <RibbonMarquee section={members.section} schoolYear={members.schoolYear} />

      <QueenSection
        name={members.queenOfTheRoom.name}
        title={members.queenOfTheRoom.title}
        photoSrc={manifest.queen[0]?.src}
      />

      <PalabanSection
        name={members.palabanNaPinay.name}
        title={members.palabanNaPinay.title}
        photoSrc={manifest.palaban[0]?.src}
      />

      <RibbonMarquee section={members.section} schoolYear={members.schoolYear} />

      <GallerySection items={manifest.gallery} />

      <LikeButton />

      <Footer section={members.section} schoolYear={members.schoolYear} />
    </main>
  );
}
