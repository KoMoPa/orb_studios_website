import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'A Premier, boutique music space for rehearsal and recording for bands and artists in Toronto, Etobicoke, Ontario',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Orb Studios - Recording and Rehearsal Studio in Toronto, ON',
  title: 'Orb Studios - Recording and Rehearsal Toronto',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
