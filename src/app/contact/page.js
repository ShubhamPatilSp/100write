import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import TopBanner from '@/components/TopBanner';
import AboutPageBanner from '@/components/AboutPageBanner';

const ContactPage = () => {
  return (
    <div>
      <TopBanner />
      <Navbar />
      <ContactForm />
      <Faq />
      <AboutPageBanner />
      <Footer />
    </div>
  );
};

export default ContactPage;
