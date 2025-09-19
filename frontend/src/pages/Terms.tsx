import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-lg text-gray-700 mb-4">
          By using PrintPhoneCover’s services, you agree to abide by our policies and guidelines.
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Users are responsible for the content they print.</li>
          <li>Refunds are only applicable for machine malfunctions or failed prints.</li>
          <li>Abuse of equipment or violation of policies may result in account suspension.</li>
          <li>Bulk orders must be scheduled in advance.</li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}
