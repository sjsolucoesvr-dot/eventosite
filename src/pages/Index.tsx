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
  <div className="min-h-screen font-body relative">
    {/* Background images with transparency */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=30'),
            url('https://images.unsplash.com/photo-1470338950318-40320a722782?w=800&q=30'),
            url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=30')
          `,
          backgroundPosition: 'top left, center right, bottom center',
          backgroundSize: '50%, 40%, 45%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-background/95" />
    </div>
    <div className="relative z-10">
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
  </div>
);

export default Index;
