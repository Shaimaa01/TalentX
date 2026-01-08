import EnhancedHero from '@/components/landing/EnhancedHero';
import HireOptions from '@/components/landing/HireOptions';
import TalentNetwork from '@/components/landing/TalentNetwork';
import TrustedBrands from '@/components/landing/TrustedBrands';
import WorldClassTalent from '@/components/landing/WorldClassTalent';
import HiringProcess from '@/components/landing/HiringProcess';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import ClientStories from '@/components/landing/ClientStories';

export default function Home() {
  return (
    <>
      <EnhancedHero />
      <HireOptions />
      <TalentNetwork />
      <TrustedBrands />
      <WorldClassTalent />
      <HiringProcess />
      <ClientStories />
      <Testimonials />
    </>
  );
}
