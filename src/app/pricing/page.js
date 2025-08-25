import Navbar from '@/components/Navbar';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import PricingPlans from '@/components/PricingPlans';
import TopBanner from '@/components/TopBanner';

export default function PricingPage() {
  return (
    <div className="bg-[#FFF7F2]">
      <TopBanner />
      <Navbar />
      <main className="py-12 md:py-24">
        <PricingPlans />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
