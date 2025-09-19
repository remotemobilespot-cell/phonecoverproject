// Temporary debug version of HomePage to identify blank page issue
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function HomePage() {
  console.log('HomePage rendering...');
  
  return (
    <div className="min-h-screen">
      <div style={{backgroundColor: 'red', padding: '20px', color: 'white'}}>
        DEBUG: HomePage is rendering!
      </div>
      
      <Header />
      
      <main style={{backgroundColor: 'blue', color: 'white', padding: '40px'}}>
        <h1>Homepage Content</h1>
        <p>If you can see this, the page is working!</p>
      </main>
      
      <Footer />
    </div>
  );
}