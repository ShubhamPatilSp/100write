import TopBanner from '../components/TopBanner';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TrustSection from '../components/TrustSection';
import AssignmentHelp from '../components/AssignmentHelp';
import Features from '../components/Features';
import DetectionCheckers from '../components/DetectionCheckers';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div>
      {/* <TopBanner /> */}
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <AssignmentHelp />
        <Features />
        <DetectionCheckers />
        <Testimonials />
        <Faq />
        {/* <Cta /> */}
      </main>
      <Footer />
    </div>
  );
}

