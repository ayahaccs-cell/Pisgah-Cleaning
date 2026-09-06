import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobilePinnedBar } from '@/components/layout/MobilePinnedBar';
import { HeroSection } from '@/components/sections/HeroSection';
import { ClientStrip } from '@/components/sections/ClientStrip';
import { ProcessJourney } from '@/components/sections/ProcessJourney';
import { ServicePillars } from '@/components/sections/ServicePillars';
import { PackageSelector } from '@/components/sections/PackageSelector';
import { EmergencyCallout } from '@/components/sections/EmergencyCallout';
import { LeadershipSection } from '@/components/sections/LeadershipSection';
import { MainLandmark } from '@/components/layout/MainLandmark';

/**
 * Shared page composition for both locale routes.
 *
 * Section order is fixed by the approved experience map: claim, capture, proof,
 * process, scope, urgency, people, contact.
 */
export function HomePage() {
  return (
    <>
      <Navbar />
      <MainLandmark>
        <HeroSection />
        <ClientStrip />
        <ProcessJourney />
        <ServicePillars />
        <PackageSelector />
        <EmergencyCallout />
        <LeadershipSection />
      </MainLandmark>
      <Footer />
      <MobilePinnedBar />
    </>
  );
}

export default HomePage;
