import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

/**
 * ORB Studios - Page Metadata Templates
 * 
 * Copy these metadata configurations to your page files:
 * - src/app/(frontend)/recording/page.tsx
 * - src/app/(frontend)/booking/page.tsx
 * - src/app/(frontend)/rates/page.tsx
 * - src/app/(frontend)/monthlyrental/page.tsx
 * - src/app/(frontend)/staff/page.tsx
 * - src/app/(frontend)/rooms/[slug]/page.tsx
 * 
 * Update with your actual content before deploying.
 */

// ============================================
// RECORDING/PRODUCTION PAGE METADATA
// ============================================
export const recordingPageMetadata: Metadata = {
  title: 'Professional Recording Studio | ORB Studios Toronto',
  description:
    'State-of-the-art recording studio in Etobicoke and Toronto with acoustically treated rooms, world-class equipment, professional engineers, and competitive rates. Book your recording session today.',
  keywords: [
    'professional recording studio',
    'recording studio Toronto',
    'recording studio Etobicoke',
    'recording engineer',
    'music production',
    'audio recording',
    'mixing and mastering',
    'professional recording',
    'album recording',
    'podcast recording studio',
    'voice-over recording',
  ],
  openGraph: {
    title: 'Professional Recording Studio | ORB Studios Toronto',
    description:
      'State-of-the-art recording studio with acoustically treated rooms and world-class equipment. Book your recording session in Etobicoke or Toronto.',
    url: `${getServerSideURL()}/recording`,
    type: 'website',
    images: [
      {
        url: `${getServerSideURL()}/api/media/file/console_video.mp4`,
        width: 1200,
        height: 630,
        alt: 'ORB Studios Professional Control Room',
      },
    ],
  },
  alternates: {
    canonical: `${getServerSideURL()}/recording`,
  },
}

// ============================================
// BOOKING/REHEARSAL SPACE PAGE METADATA
// ============================================
export const bookingPageMetadata: Metadata = {
  title: 'Book Rehearsal Space | ORB Studios | Etobicoke & Toronto',
  description:
    'Book our boutique rehearsal space with world-class equipment for bands and solo artists. Hourly and monthly rentals available. Private rooms with complete privacy in Etobicoke.',
  keywords: [
    'rehearsal space booking',
    'band practice room',
    'private rehearsal space',
    'rehearsal space rental',
    'book rehearsal room',
    'band jam space',
    'rehearsal space Etobicoke',
    'rehearsal space Toronto',
    'music practice space',
    'soundproof rehearsal room',
  ],
  openGraph: {
    title: 'Book Rehearsal Space | ORB Studios',
    description:
      'Private boutique rehearsal space with excellent gear. Perfect for band rehearsals, jam sessions, and creative collaboration. Book now.',
    url: `${getServerSideURL()}/booking`,
    type: 'website',
    images: [
      {
        url: `${getServerSideURL()}/api/media/file/liveroom1.jpg`,
        width: 1200,
        height: 630,
        alt: 'ORB Studios Rehearsal Space',
      },
    ],
  },
  alternates: {
    canonical: `${getServerSideURL()}/booking`,
  },
}

// ============================================
// MONTHLY RENTAL PAGE METADATA
// ============================================
export const monthlyRentalMetadata: Metadata = {
  title: 'Monthly Studio Rental | Unlimited Access | ORB Studios',
  description:
    'Get unlimited access to our professional recording studio for an entire month. Perfect for long-term projects, intensive rehearsals, and ongoing productions. Competitive monthly rates.',
  keywords: [
    'monthly studio rental',
    'unlimited studio access',
    'monthly recording studio',
    'studio rental package',
    'long-term studio rental',
    'band rental space',
    'monthly music studio',
    'rehearsal space membership',
    'affordable studio rental',
    'monthly gear rental',
  ],
  openGraph: {
    title: 'Monthly Studio Rental | Unlimited Access | ORB Studios',
    description:
      'Unlimited studio access for a full month. Perfect for long-term projects and intensive creative work. Join our monthly rental program.',
    url: `${getServerSideURL()}/monthlyrental`,
    type: 'website',
  },
  alternates: {
    canonical: `${getServerSideURL()}/monthlyrental`,
  },
}

// ============================================
// RATES PAGE METADATA
// ============================================
export const ratesPageMetadata: Metadata = {
  title: 'Studio Rates & Pricing | ORB Studios | Affordable Toronto Recording',
  description:
    'View ORB Studios competitive rates for hourly bookings, monthly memberships, gear rental, and monthly storage. Transparent pricing with no hidden fees.',
  keywords: [
    'studio rates',
    'recording studio pricing',
    'hourly studio rental',
    'monthly studio membership',
    'affordable recording studio',
    'studio rental cost',
    'gear rental pricing',
    'Toronto recording rates',
    'Etobicoke studio prices',
  ],
  openGraph: {
    title: 'Studio Rates & Pricing | ORB Studios',
    description:
      'Competitive, transparent pricing for hourly bookings and monthly memberships. No hidden fees. Quality studio at affordable rates.',
    url: `${getServerSideURL()}/rates`,
    type: 'website',
  },
  alternates: {
    canonical: `${getServerSideURL()}/rates`,
  },
}

// ============================================
// STAFF/TEAM PAGE METADATA
// ============================================
export const staffPageMetadata: Metadata = {
  title: 'Meet Our Team | ORB Studios | Professional Recording Engineers',
  description:
    'Meet the talented audio engineers and production specialists at ORB Studios. Experienced professionals ready to help bring your music to life.',
  keywords: ['recording engineer', 'music producer', 'audio engineer', 'studio team', 'ORB Studios staff'],
  openGraph: {
    title: 'Meet Our Team | ORB Studios',
    description: 'Experienced recording engineers and producers dedicated to your creative vision.',
    url: `${getServerSideURL()}/staff`,
    type: 'website',
  },
  alternates: {
    canonical: `${getServerSideURL()}/staff`,
  },
}

// ============================================
// INDIVIDUAL ROOM PAGE (JAM ROOM)
// ============================================
export const jamRoomMetadata: Metadata = {
  title: 'Jam Room | ORB Studios | Band Rehearsal & Practice Space',
  description:
    'Our spacious Jam Room is perfect for band rehearsals and group practice sessions. Features excellent instrumentation, professional gear, and acoustically treated for optimal sound.',
  keywords: [
    'jam room',
    'band practice',
    'rehearsal room',
    'group practice space',
    'band rehearsal',
    'jam space',
  ],
  openGraph: {
    title: 'Jam Room | ORB Studios',
    description: 'Professional band rehearsal and practice space with excellent gear and acoustics.',
    url: `${getServerSideURL()}/rooms/jam-room`,
    type: 'website',
  },
  alternates: {
    canonical: `${getServerSideURL()}/rooms/jam-room`,
  },
}

// ============================================
// INDIVIDUAL ROOM PAGE (MIXING ROOM)
// ============================================
export const mixingRoomMetadata: Metadata = {
  title: 'Mixing Room | Professional Mixing Studio | ORB Studios',
  description:
    'Our professional Mixing Room features acoustically treated walls, industry-standard monitoring, and high-end mixing equipment. Perfect for mixing, mastering, and audio production.',
  keywords: [
    'mixing room',
    'mixing studio',
    'mastering studio',
    'audio production',
    'professional mixing',
    'mixing and mastering',
  ],
  openGraph: {
    title: 'Mixing Room | Professional Mixing Studio | ORB Studios',
    description: 'Professional mixing and mastering studio with industry-standard equipment and acoustics.',
    url: `${getServerSideURL()}/rooms/mixing-room`,
    type: 'website',
  },
  alternates: {
    canonical: `${getServerSideURL()}/rooms/mixing-room`,
  },
}

// ============================================
// ADDITIONAL SERVICE PAGES
// ============================================

export const gearStorageMetadata: Metadata = {
  title: 'Secure Gear Storage | ORB Studios | Monthly Storage Solutions',
  description:
    'Secure, climate-controlled gear storage available monthly. Perfect for musicians who need safe storage for instruments, amplifiers, and equipment.',
  keywords: [
    'gear storage',
    'equipment storage',
    'instrument storage',
    'secure storage',
    'climate controlled storage',
  ],
}

export const samplesMetadata: Metadata = {
  title: 'Studio Samples & Portfolio | ORB Studios | Hear Our Work',
  description:
    'Listen to samples of recordings produced at ORB Studios. Explore our portfolio of professional work from diverse artists and genres.',
  keywords: [
    'recording samples',
    'studio portfolio',
    'music production samples',
    'recorded music',
  ],
}

export const activitiesMetadata: Metadata = {
  title: 'Studio Activities & Use Cases | ORB Studios | What We Offer',
  description:
    'Discover all the ways you can use ORB Studios. From band recording and rehearsal to mixing, mastering, podcasting, and video production.',
  keywords: [
    'studio activities',
    'what to do in studio',
    'recording services',
    'studio capabilities',
    'music production services',
  ],
}
