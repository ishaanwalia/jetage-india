import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedProducts />
      <TrustBadges />
      <Testimonials />
    </>
  );
}