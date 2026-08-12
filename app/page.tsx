import HeroSlider from "@/components/home/HeroSlider";
import ModelsSection from "@/components/home/ModelsSection";
import OffersSlider from "@/components/home/OffersSlider";
import BestOfBothWorlds from "@/components/home/BestOfBothWorlds";
import AlGhurairSection from "@/components/home/AlGhurairSection";
import Testimonials from "@/components/home/Testimonials";
import FeaturedNews from "@/components/home/FeaturedNews";
import InstagramFeed from "@/components/home/InstagramFeed";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ModelsSection />
      <OffersSlider />
      <BestOfBothWorlds />
      <AlGhurairSection />
      <Testimonials />
      <FeaturedNews />
      <InstagramFeed />
    </>
  );
}
