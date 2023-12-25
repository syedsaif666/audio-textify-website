import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

const meta = {
  title: 'Audio Textify',
  description:
    'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  robots: meta.robots,
  favicon: meta.favicon,
  type: meta.type,
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description
  }
};

export default function RootLayout({
  children
}: PropsWithChildren) {

  return (
    <html lang="en" >
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>
      <body className="loading">
        <SupabaseProvider>
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
          </main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
