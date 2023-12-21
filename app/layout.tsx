import SupabaseProvider from './supabase-provider';
import { PropsWithChildren } from 'react';
import 'styles/main.css';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import cn from 'classnames';
import { Inter } from 'next/font/google';
import Head from 'next/head';
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

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-inter'
});

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
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
          {/* <Footer /> */}
          <Footer />
        </SupabaseProvider>
      </body>
    </html>
  );
}
