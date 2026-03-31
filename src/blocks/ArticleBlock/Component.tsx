'use client'

import React from 'react'

import type { ArticleBlock as ArticleBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = ArticleBlockProps & {
  disableInnerContainer?: boolean
  ctas?: Array<{ text: string; url: string }>
}

export const ArticleBlock: React.FC<Props> = (props) => {
  const { title, content, media, imagePosition = 'right', cta, ctas, titleFont = 'bebas', childBlocks } = props

  const textSizeClass = titleFont === 'glitch' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'
  const glitchEffect = titleFont === 'glitch' ? {
    textShadow: '0.08em 0.08em 0 rgba(255, 0, 0, 0.6), 0.15em 0.15em 0 rgba(0, 255, 255, 0.6)',
    letterSpacing: '-0.03em',
  } : {}

  const contentSection = (
    <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 lg:py-32">
      <h2 
        className={`${titleFont} ${textSizeClass} font-bold uppercase mb-8 tracking-tight leading-none`}
        style={glitchEffect}
      >
        {title}
      </h2>
      <div className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--dark)' }}>
        {content && <RichText data={content} enableGutter={false} />}
      </div>
      <div className="flex flex-wrap gap-4">
        {ctas && ctas.length > 0 ? (
          ctas.map((button, index) => (
            <a
              key={index}
              href={button.url}
              className="btn-console btn-console--red"
            >
              {button.text}
            </a>
          ))
        ) : cta ? (
          <a
            href={cta.url}
            className="btn-console btn-console--red"
          >
            {cta.text}
          </a>
        ) : null}
      </div>
    </div>
  )

  const imageSection = (
    <div className="w-full overflow-hidden image-container">
      {media && typeof media === 'object' && (
        <Media
          resource={media}
          imgClassName="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  )

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-0" style={{ backgroundColor: 'var(--light)' }}>
      <div className={`grid grid-cols-1 lg:grid-cols-2 items-center`}>
        {imagePosition === 'left' ? (
          <>
            {imageSection}
            {contentSection}
          </>
        ) : (
          <>
            {contentSection}
            {imageSection}
          </>
        )}
      </div>
    </section>
  )
}
