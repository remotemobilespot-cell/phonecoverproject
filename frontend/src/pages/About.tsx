import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <strong>PrintPhoneCover</strong> — your trusted partner for high-quality, affordable,
          and on-demand printing solutions.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          With multiple store locations and 24/7 machine availability, we make it easier than ever
          to print documents, photos, and custom phone covers wherever you are.
        </p>
        <p className="text-lg text-gray-700">
          Our mission is simple: <em>to provide fast, reliable, and eco-friendly printing for everyone</em>.
          Whether you’re a student, business, or creative professional, we’ve got you covered.
        </p>
      </main>

      <Footer />
    </div>
  );
}
