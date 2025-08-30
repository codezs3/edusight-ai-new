import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import { AnalyticsShowcase } from '@/components/landing/AnalyticsShowcase';
import { ReportShowcase } from '@/components/landing/ReportShowcase';
import { StatsSection } from '@/components/landing/StatsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CTASection } from '@/components/landing/CTASection';

import { DemoSection } from '@/components/landing/DemoSection';
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
        <DemoSection />
        <StatsSection />
        <TestimonialsSection />
        <PricingSection />
        <NewsletterSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}