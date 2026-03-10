import { Header } from "@/components/mazinger/header";
import { HeroSection } from "@/components/mazinger/hero-section";
import { AboutSection } from "@/components/mazinger/about-section";
import { CharactersSection } from "@/components/mazinger/characters-section";
import { TimelineSection } from "@/components/mazinger/timeline-section";
import { GallerySection } from "@/components/mazinger/gallery-section";
import { Footer } from "@/components/mazinger/footer";

export default function MazingerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <AboutSection />
      <div id="characters">
        <CharactersSection />
      </div>
      <div id="timeline">
        <TimelineSection />
      </div>
      <div id="gallery">
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}
