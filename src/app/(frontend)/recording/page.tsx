import type { Metadata } from 'next'
import React from 'react'
import { ArticleBlock } from '@/blocks/ArticleBlock/Component'
import { MediumImpactHero } from '@/heros/MediumImpact'

export const metadata: Metadata = {
  title: 'Recording at Orb Studios',
  description: 'Professional recording services and studio time at Orb Studios.',
}

export default function RecordingPage() {
  // Hero section content
  const heroContent = {
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
              text: 'You can fully record, produce, and perform through Orb Studio\'s professional recording setup. Whether it\'s a single, an album, or a live show, we\'ve got you covered to put it out to the world.',
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

  // Article blocks for each section
  const article1Content = {
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
              text: 'We start with 32 analogue inputs from the Jam Room to the Mixing Room, through our Allen & Heath console, with 32 channels of EQ and 8 channels of compression available before you ever hit the converters.',
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

  const article2Content = {
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
              text: 'We then have rock solid AD/DA conversion through the Orion 32+, which can be patched in at 16 channels as well for other outboard preamps or analogue gear. In our M1 Mac we have a number of available DAWs and hundreds of plugins, many at 0 latency so you can record through them.',
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

  const article3Content = {
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
              text: 'We have a finely tuned and treated Control/Mixing room with Yamaha HS8 Monitors and attached subwoofer, as well as monitoring options from the console or computer, and the option to plug in your own monitors.',
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

  const article4Content = {
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
              text: 'We also have a great collection of microphones, including industry standards in Large Diaphragm and Small Diaphragm condenser and Dynamic types. We also heavily utilize the Slate Virtual Microphone System with two ML-1A\'s and two ML-2A\'s, giving you access to a number of legendary microphones to record through. All emulations can be printed post-recording so that you don\'t need the license if you take your mix elsewhere.',
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

  const mediaObject = {
    id: '2',
    alt: 'Recording Equipment',
    filename: 'recording-article.jpg',
    mimeType: 'image/jpeg',
    filesize: 123456,
    width: 1920,
    height: 1080,
    url: '/api/media/file/recording-article.jpg',
  }

  const media1 = {
    id: '3',
    alt: 'Allen & Heath Console',
    filename: 'console.jpg',
    mimeType: 'image/jpeg',
    filesize: 123456,
    width: 1920,
    height: 1080,
    url: '/api/media/file/console.jpg',
  }

  const media2 = {
    id: '4',
    alt: 'Control Room Setup',
    filename: 'controlroom1.jpg',
    mimeType: 'image/jpeg',
    filesize: 123456,
    width: 1920,
    height: 1154,
    url: '/api/media/file/controlroom1.jpg',
  }

  const media3 = {
    id: '5',
    alt: 'Mixing Room',
    filename: 'controlroom2.jpg',
    mimeType: 'image/jpeg',
    filesize: 123456,
    width: 1920,
    height: 1154,
    url: '/api/media/file/controlroom2.jpg',
  }

  const media4 = {
    id: '6',
    alt: 'Recording Studio',
    filename: 'controlroom3.jpg',
    mimeType: 'image/jpeg',
    filesize: 123456,
    width: 1920,
    height: 1154,
    url: '/api/media/file/controlroom3.jpg',
  }

  return (
    <article>
      {/* Hero Section */}
      <MediumImpactHero richText={heroContent} overlayColor="bg-white/90" textColor="text-black" />

      {/* Article Blocks */}
      <div className="my-16">
        <ArticleBlock
          title="Analogue Recording"
          content={article1Content}
          media={media1}
          imagePosition="right"
          titleFont="bebas"
        />
      </div>

      <div className="my-16">
        <ArticleBlock
          title="Conversion & DAW"
          content={article2Content}
          media={media2}
          imagePosition="right"
          titleFont="bebas"
        />
      </div>

      <div className="my-16">
        <ArticleBlock
          title="Monitoring"
          content={article3Content}
          media={media3}
          imagePosition="right"
          titleFont="bebas"
        />
      </div>

      <div className="my-16">
        <ArticleBlock
          title="Microphone Collection"
          content={article4Content}
          media={media4}
          imagePosition="right"
          titleFont="bebas"
        />
      </div>
    </article>
  )
}
