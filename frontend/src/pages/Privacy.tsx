import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-lg text-gray-700 mb-4">
          At PrintPhoneCover, your privacy matters. We collect only the information needed to provide
          you with excellent printing services.
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>We do not share your personal data with third parties without your consent.</li>
          <li>All payment information is encrypted and handled securely.</li>
          <li>We may use anonymized data to improve our services and user experience.</li>
          <li>You can request deletion of your account and data anytime.</li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}
