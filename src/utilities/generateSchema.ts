import { getServerSideURL } from './getURL'

export const generateOrganizationSchema = () => {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#organization`,
    name: 'ORB Studios',
    url: baseUrl,
    logo: `${baseUrl}/api/media/file/liveroom1.jpg`,
    description:
      'Premier boutique recording studio and rehearsal space featuring professional acoustically treated rooms, world-class equipment, monthly rentals, gear storage, and complete privacy.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[Your Street Address]',
      addressLocality: 'Etobicoke',
      addressRegion: 'ON',
      postalCode: '[Your Postal Code]',
      addressCountry: 'CA',
    },
    telephone: '[Your Phone Number]',
    email: 'info@orbstudios.ca',
    priceRange: '$$',
    image: [`${baseUrl}/api/media/file/liveroom1.jpg`, `${baseUrl}/api/media/file/console_video.mp4`],
    areaServed: [
      {
        '@type': 'City',
        name: 'Etobicoke',
        addressRegion: 'ON',
      },
      {
        '@type': 'City',
        name: 'Toronto',
        addressRegion: 'ON',
      },
    ],
    serviceArea: [
      {
        '@type': 'City',
        name: 'Etobicoke',
        addressRegion: 'ON',
      },
      {
        '@type': 'City',
        name: 'Toronto',
        addressRegion: 'ON',
      },
    ],
    services: [
      {
        '@type': 'LocalBusiness',
        name: 'Professional Recording Studio',
        description: 'Fully professional recording studio with acoustically treated rooms and world-class equipment',
      },
      {
        '@type': 'LocalBusiness',
        name: 'Boutique Rehearsal Space',
        description: 'Premier rehearsal space for bands and artists with excellent gear and complete privacy',
      },
      {
        '@type': 'LocalBusiness',
        name: 'Monthly Rentals',
        description: 'Affordable monthly rental packages for ongoing studio access',
      },
      {
        '@type': 'LocalBusiness',
        name: 'Gear Storage',
        description: 'Secure gear storage solutions for musicians and bands',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '[Your Phone Number]',
      contactType: 'Customer Service',
      email: 'info@orbstudios.ca',
    },
    sameAs: [
      'https://www.facebook.com/orb-studios',
      'https://www.instagram.com/orb-studios',
      'https://www.youtube.com/@orbstudios',
    ],
  }
}

export const generateRecordingStudioSchema = () => {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'ORB Studios - Professional Recording Studio',
    description: 'Professional recording studio with acoustically treated rooms and world-class professional equipment',
    url: `${baseUrl}/recording`,
    image: `${baseUrl}/api/media/file/console_video.mp4`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[Your Street Address]',
      addressLocality: 'Etobicoke',
      addressRegion: 'ON',
      postalCode: '[Your Postal Code]',
      addressCountry: 'CA',
    },
    priceRange: '$$-$$$',
    areaServed: ['Toronto', 'Etobicoke'],
  }
}

export const generateRehearsalSpaceSchema = () => {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicVenue',
    name: 'ORB Studios - Boutique Rehearsal Space',
    description: 'Premier boutique rehearsal space for bands and artists with excellent gear and complete privacy',
    url: `${baseUrl}/booking`,
    image: `${baseUrl}/api/media/file/liveroom1.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[Your Street Address]',
      addressLocality: 'Etobicoke',
      addressRegion: 'ON',
      postalCode: '[Your Postal Code]',
      addressCountry: 'CA',
    },
    priceRange: '$$',
  }
}

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
