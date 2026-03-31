'use client'

import React from 'react'

import { CustomHero } from '@/heros/CustomHero'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { FAQBlock } from '@/blocks/FAQBlock/Component'

export default function Home() {
  return (
    <>
      <main style={{ minHeight: '70vh' }}>
        <div style={{ width: '100%' }}>
          {/* Hero Block Example */}
          <CustomHero
            type="custom"
            backgroundImage={{
              id: 1,
              filename: 'liveroom1.jpg',
              alt: 'Recording studio',
              url: '/media/liveroom1.jpg',
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            } as any}
            title="ORB STUDIOS"
            titleFont="spraypaint"
            subtitle="Premier Boutique Music Space"
            description="Etobicoke's premier recording and rehearsal space with world-class equipment and professional tracking facilities."
            cta={{ text: 'Book Now', url: '/booking' }}
          />

          
          {/* Additional content goes here */}
          <ArticleBlock
            blockType="articleBlock"
            title="World-Class Recording Equipment"
            titleFont="glitch"
            content={{
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Experience professional-grade recording with state-of-the-art equipment and expert engineering support.',
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Our studio features industry-leading gear and acoustically treated rooms for pristine recordings.',
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                ],
              },
            }}
            media={{
              id: 1,
              filename: 'console.jpg',
              alt: 'Professional recording console',
              url: '/media/console.jpg',
              width: 1200,
              height: 800,
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            } as any}
            imagePosition="right"
            cta={{
              text: 'Book a Session',
              url: '#booking',
            }}
          />
          <ArticleBlock
            blockType="articleBlock"
            title="Use Orb Studios in a number of ways"
            titleFont="spraypaint"
            content={{
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Check out a list of suggested activities Orb can be used for, or feel free to contact us for whatever you want.',
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                  {
                    children: [
                      {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Perfect for practice, rehearsal, recording, streaming, or shooting video.',
                        type: 'text',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    type: 'paragraph',
                    version: 1,
                  },
                ],
              },
            }}
            media={{
              id: 2,
              filename: 'controlroom1.jpg',
              alt: 'Professional control room',
              url: '/media/controlroom1.jpg',
              width: 1200,
              height: 800,
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            } as any}
            imagePosition="left"
            cta={{
              text: 'Explore Activities',
              url: '/activities',
            }}
          />
          <FAQBlock
            blockType="faqBlock"
            title="Frequently Asked Questions"
          />
        </div>
      </main>
    </>
  )
}
