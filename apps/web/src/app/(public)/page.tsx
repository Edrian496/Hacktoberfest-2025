import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { HeroSection } from '../../components/heroSection';
import { AboutSection } from '../../components/aboutSection';
import { PartnersSection } from '../../components/partnerSection';
import { CampaignsSection } from '../../components/campaignSection';
import CursorLightBackground from '../../components/cursor_background'; 

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative"> 
      <CursorLightBackground />
      <div className="relative z-10"> 
        <Header />
        <main>
          <section id="home">
            <HeroSection />
          </section>
          <section id="about">
            <AboutSection />
          </section>
          <section id="partners">
            <PartnersSection />
          </section>
          <section id="campaigns">
            <CampaignsSection />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}