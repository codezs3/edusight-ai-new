import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduSight - Educational Analytics Platform',
  description: 'Comprehensive student assessment platform evaluating Academic Performance, Psychological Well-being & Physical Health with AI-powered analytics.',
  keywords: 'EPR Assessment, EduSight, Educational Analytics, Student Assessment, AI Learning, K-12 Education, Career Guidance',
  authors: [{ name: 'EduSight Team' }],
  openGraph: {
    title: 'EduSight - Educational Analytics Platform',
    description: 'Transform your child\'s learning with comprehensive assessment covering Academic, Psychological, and Physical development',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduSight - Educational Analytics Platform',
    description: 'Comprehensive student assessment platform with AI-powered analytics',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
