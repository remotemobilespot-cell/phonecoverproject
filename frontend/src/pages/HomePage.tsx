import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/common/HeroSection';
import StoreLocations from '@/components/StoreLocations';
import TestimonialsSlider from '@/components/TestimonialsSlider';
import NewsletterSignup from '@/components/forms/NewsletterSignup';

export default function HomePage() {
  console.log('HomePage rendering...');
  
  return (
    <div className="min-h-screen">
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