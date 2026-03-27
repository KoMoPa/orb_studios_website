'use client'

import React from 'react'

import type { ArticleBlock as ArticleBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = ArticleBlockProps & {
  disableInnerContainer?: boolean
}

export const ArticleBlock: React.FC<Props> = (props) => {
  const { title, content, media, imagePosition = 'right', cta, titleFont = 'bebas' } = props

  const contentSection = (
    <div>
      <h2 className={`${titleFont} text-4xl font-bold uppercase mb-6 tracking-wider`}>
        {title}
      </h2>
      <div className="text-base leading-relaxed mb-8" style={{ color: 'var(--dark)' }}>
        {content && <RichText data={content} enableGutter={false} />}
      </div>
      {cta && (
        <a
          href={cta.url}
          className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-2xl uppercase tracking-wider text-sm"
        >
          {cta.text}
        </a>
      )}
    </div>
  )

  const imageSection = (
    <div className="w-full rounded overflow-hidden shadow-2xl relative" style={{ minHeight: '400px' }}>
      {media && typeof media === 'object' && (
        <Media
          fill
          resource={media}
          imgClassName="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  )

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: 'var(--light)' }}>
      <div
        className={`max-w-5xl mx-auto grid gap-12 items-center grid-cols-1 lg:grid-cols-2`}
      >
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
