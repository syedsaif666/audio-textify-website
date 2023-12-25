import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

const meta = {
  title: 'Classway | AI powered Assignment Assistant',
  description:
    'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.',
  // cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  // url: 'https://classway-website.vercel.app/',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  // cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  // url: meta.url,
  type: meta.type,
  openGraph: {
    // url: meta.url,
    title: meta.title,
    description: meta.description,
    // cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description
    // cardImage: meta.cardImage
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
