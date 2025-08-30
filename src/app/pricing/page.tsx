import { Metadata } from 'next';
import { SubscriptionPlans } from '@/components/payments/SubscriptionPlans';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Pricing Plans - EduSight',
  description: 'Choose the perfect plan for your educational assessment needs. Flexible pricing for individuals, families, and institutions.',
};

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
