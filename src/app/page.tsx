import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import { AnalyticsShowcase } from '@/components/landing/AnalyticsShowcase';
import { ReportShowcase } from '@/components/landing/ReportShowcase';
import { TestVaultShowcase } from '@/components/landing/TestVaultShowcase';
import { StoreCallToAction } from '@/components/landing/StoreCallToAction';
import { DemoSection } from '@/components/landing/DemoSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { NewsletterSection } from '@/components/landing/NewsletterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AnalyticsShowcase />
        <ReportShowcase />
        <TestVaultShowcase />
        <StoreCallToAction />
        <DemoSection />
        <StatsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}