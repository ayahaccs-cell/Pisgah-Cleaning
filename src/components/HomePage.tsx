import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { EstimateCard } from '@/components/sections/EstimateCard';
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
 *
 * The trust bar that used to sit between capture and proof is gone. It carried
 * a star rating, a sector list and a guarantee line, all of which the hero
 * proof strip and the client register now say better and with evidence
 * attached, so it read as a second, weaker version of the same claim.
 */
export function HomePage() {
  return (
    <>
      <Navbar />
      <MainLandmark>
        <HeroSection />
        <EstimateCard />
        <ClientStrip />
        <ProcessJourney />
        <ServicePillars />
        <PackageSelector />
        <EmergencyCallout />
        <LeadershipSection />
      </MainLandmark>
      <Footer />
    </>
  );
}

export default HomePage;
