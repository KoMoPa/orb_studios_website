import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Form } from '@payloadcms/plugin-form-builder/types'

import { CustomHero } from '@/heros/CustomHero'
import { AccentHero } from '@/heros/AccentHero'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { MonthlyCardsBlock } from '@/blocks/MonthlyCards/Component'
import { FAQBlock } from '@/blocks/FAQBlock/Component'

export default async function Home() {
  const payload = await getPayload({ config: configPromise })

  // Fetch the form by title
  const formsData = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Sign Up For Monthly Waitlist',
      },
    },
  })

  const form = formsData.docs[0] as Form | undefined
  return (
    <>
      <main style={{ minHeight: '70vh' }}>
        <div style={{ width: '100%' }}>
          {/* Hero Block Example */}
          <CustomHero
            type="custom"
            backgroundImage={{
              id: 1,
              filename: 'console_video.mp4',
              alt: 'Recording studio',
              url: '/api/media/file/console_video.mp4',
            } as any}
            fallbackImage={{
              id: 1,
              filename: 'liveroom1.jpg',
              alt: 'Recording studio',
              url: '/api/media/file/liveroom1.jpg',
            } as any}
            title="ORB STUDIOS"
            titleFont="vinyl"
            subtitle="Premier Boutique Music Space"
            description="Etobicoke's premier recording and rehearsal space with world-class equipment and professional tracking facilities."
            cta={{ text: 'Book Now', url: '/booking' }}
          />

          
          {/* Rooms Feature Section */}
          <ArticleBlock
            blockType="articleBlock"
            title="Our Spaces"
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
                        text: "ORB Studios features two expertly designed spaces to suit your creative needs. Whether you're looking to jam with a band or mix your masterpiece, we have the perfect room for you.",
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
              id: 3,
              filename: 'liveroom1.jpg',
              alt: 'ORB Studios rooms',
              url: '/api/media/file/liveroom1.jpg',
              width: 1200,
              height: 800,
            } as any}
            imagePosition="left"
            ctas={[
              { text: 'Jam Room', url: '/rooms/jamroom' },
              { text: 'Mixing Room', url: '/rooms/mixingroom' },
            ]}
          />
          <ArticleBlock
            blockType="articleBlock"
            title="Use Orb Studios in a number of ways"
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
              url: '/api/media/file/controlroom1.jpg',
              width: 1200,
              height: 800,
            } as any}
            imagePosition="right"
            cta={{
              text: 'Explore Activities',
              url: '/activities',
            }}
          />
          <AccentHero
            title="How to Use Our Great Equipment"
            description="Master our professional-grade equipment with expert guidance and tutorials. Learn the ins and outs of our gear to get the best results for your project."
            backgroundImage={{
              url: '/api/media/file/console.jpg',
              alt: 'Professional recording equipment',
            }}
            links={[
              {
                link: {
                  type: 'custom',
                  url: '/recording',
                  label: 'View Guides',
                  appearance: 'default',
                },
              },
            ]}
          />
          <MonthlyCardsBlock
            title="Monthly Rentals"
            form={form}
            cards={[
              {
                title: 'Book for the Month',
                description: 'Get unlimited access to ORB Studios for an entire month. Perfect for long-term projects, ongoing recording sessions, or intensive rehearsals.',
                type: 'link',
                link: {
                  url: '/monthlyrental',
                  label: 'Learn More',
                },
              },
              {
                title: 'Already a Monthly?',
                description: 'As a monthly member, you get priority booking and additional perks. Schedule your sessions at any time that works for you.',
                type: 'action',
                link: {
                  url: '/booking/monthly',
                  label: 'Book Your Session',
                },
              },
              {
                title: 'Join the Waitlist',
                description: 'Interested in becoming a monthly member? Sign up for our waitlist and we\'ll notify you when spots become available.',
                type: 'form',
              },
            ]}
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
