import Navbar from '@/components/Navbar';
import AboutHero from '@/components/AboutHero';
import WhoIsItFor from '@/components/WhoIsItFor';
import SmartWritingAssistant from '@/components/SmartWritingAssistant';
import PassAiCheckers from '@/components/PassAiCheckers';
import OurTeam from '@/components/OurTeam';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import TopBanner from '@/components/TopBanner';
import AboutPageBanner from '@/components/AboutPageBanner';

const AboutPage = () => {
  return (
    <div className="bg-[#FFF7F2]">
      <TopBanner />
      <Navbar />
      <AboutHero />
      <WhoIsItFor />
      <SmartWritingAssistant />
      <PassAiCheckers />
      <OurTeam />
      <AboutPageBanner />
      <Faq />
      <Footer />
    </div>
  );
};

export default AboutPage;
