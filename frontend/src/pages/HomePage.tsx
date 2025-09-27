
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/common/HeroSection';
import StoreLocations from '@/components/StoreLocations';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import NewsletterSignup from '@/components/forms/NewsletterSignup';
import { SEO } from '@/components/SEO';

export default function HomePage() {
  console.log('HomePage rendering...');
  
  return (
    <div className="min-h-screen">
      <SEO
        title="PrintPhoneCover - Custom Phone Cases | Print Your Own Design"
        description="Create and print your own custom phone case with PrintPhoneCover. Fast delivery, premium quality, and easy online design. Available for iPhone, Samsung, and more."
        keywords="custom phone case, print phone cover, personalized phone case, iPhone case, Samsung case, photo case, design your own case, printphonecover.com"
        canonical="https://printphonecover.com/"
      />
      <Header />
      <main>
        <HeroSection />
        <StoreLocations />
        <TestimonialsSlider />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
}