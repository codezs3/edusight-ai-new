import { Metadata } from 'next';
import { SubscriptionPlans } from '@/components/payments/SubscriptionPlans';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata } from '@/lib/seo/utils';

export const metadata: Metadata = generateMetadata({
  page: 'pricing'
});

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  );
}
