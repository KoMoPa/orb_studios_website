import type { Metadata } from 'next'
import Script from 'next/script'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&family=Rubik+Glitch&family=Rubik+Vinyl&family=Rubik+Spray+Paint&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        {/* <link href="/favicon.svg" rel="icon" type="image/svg+xml" /> */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '2169272740505039'); fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=2169272740505039&ev=PageView&noscript=1" alt="" />
        </noscript>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YG6453PTYW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YG6453PTYW');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'ORB Studios - Recording & Rehearsal Space | Etobicoke, Toronto',
  description:
    'Premier boutique recording studio and rehearsal space in Etobicoke and Toronto. Professional acoustically treated rooms, world-class equipment, monthly rentals, gear storage, and complete privacy for musicians and bands.',
  keywords: [
    'recording studio Etobicoke',
    'recording studio Toronto',
    'rehearsal space Toronto',
    'professional recording',
    'music studio',
    'band rehearsal space',
    'recording engineer',
    'music production',
    'affordable studio rental',
    'monthly gear rental',
    'acoustic treatment',
    'private rehearsal space',
  ],
  authors: [{ name: 'ORB Studios' }],
  creator: 'ORB Studios',
  publisher: 'ORB Studios',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: getServerSideURL(),
  },
  openGraph: mergeOpenGraph({
    title: 'ORB Studios - Recording & Rehearsal Space | Etobicoke, Toronto',
    description:
      'Premier boutique recording studio and rehearsal space in Etobicoke and Toronto. Professional acoustically treated rooms, world-class equipment, monthly rentals, gear storage, and complete privacy.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'ORB Studios',
  }),
  twitter: {
    card: 'summary_large_image',
    creator: '@orbstudios',
    site: '@orbstudios',
    title: 'ORB Studios - Recording & Rehearsal Space | Etobicoke, Toronto',
    description:
      'Premier boutique recording studio and rehearsal space in Etobicoke and Toronto with world-class equipment and complete privacy.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
}
