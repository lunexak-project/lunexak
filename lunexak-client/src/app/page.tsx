import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import SearchResults from "@/components/home/SearchResults";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import TrendingProducts from "@/components/home/TrendingProducts";
import NewArrivals from "@/components/home/NewArrivals";
import TrustSection from "@/components/home/TrustSection";
import BrandStory from "@/components/home/BrandStory";
import HomeAuthCheck from "@/components/home/HomeAuthCheck";

export default function Home() {
  return (
    <HomeAuthCheck>
      <HeroSection />

      <SearchBar />
      <SearchResults />

      <FeaturedCategories />

      <TrendingProducts />

      <NewArrivals />

      <TrustSection />

      <BrandStory />
    </HomeAuthCheck>
  );
}