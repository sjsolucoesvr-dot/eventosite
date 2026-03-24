import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import SitePreview from "@/components/landing/SitePreview";
import RSVPSection from "@/components/landing/RSVPSection";
import GiftListSection from "@/components/landing/GiftListSection";
import FreeTools from "@/components/landing/FreeTools";
import MarketplaceTeaser from "@/components/landing/MarketplaceTeaser";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen font-body">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <Features />
    <SitePreview />
    <RSVPSection />
    <GiftListSection />
    <FreeTools />
    <MarketplaceTeaser />
    <Testimonials />
    <Pricing />
    <FAQ />
    <Footer />
  </div>
);

export default Index;
