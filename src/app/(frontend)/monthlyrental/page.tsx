'use client'

// import type { Metadata } from 'next'
import React from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { ParallaxBlock } from '@/blocks/ParallaxBlock/Component'
import controlroom1 from '@/../../public/media/controlroom1.jpg'

// Note: Metadata export not compatible with 'use client'
// export const metadata: Metadata = {
//   title: 'All-Inclusive Monthly Rental',
//   description: 'Explore our flexible monthly rental options for studio space.',
// }

export default function MonthlyRentalsPage() {
  const richTextData = {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              version: 1,
              text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
              format: 0,
            },
          ],
          format: '',
          indent: 0,
        },
      ],
      format: '',
      indent: 0,
      version: 3,
    },
  }

  return (
    <ParallaxProvider>
      <article className="pt-16 pb-24">
      <ParallaxBlock
        title="All-Inclusive Monthly Rental"
        media={{
          id: '1',
          alt: 'Control Room Setup',
          filename: 'controlroom1.jpg',
          mimeType: 'image/jpeg',
          filesize: 123456,
          width: 1920,
          height: 1154,
          url: '/media/controlroom1.jpg',
        }}
        overlayOpacity={0.4}
        overlayColor="#8B1A1A"
        richText={richTextData}
        minHeight={1800}
      />
      </article>
    </ParallaxProvider>
  )
}
