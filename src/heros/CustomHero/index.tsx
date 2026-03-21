'use client'

import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'

type CustomHeroProps = {
  backgroundImage?: Page['hero']['backgroundImage']
  title?: string
  subtitle?: string
  description?: string
  cta?: {
    text: string
    url: string
  }
  overlay?: 'dark' | 'light' | 'none'
  titleFont?: string
}

export const CustomHero: React.FC<CustomHeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  description,
  cta,
  overlay = 'dark',
  titleFont = 'vinyl',
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  let imageUrl = ''

  if (backgroundImage) {
    if (typeof backgroundImage === 'object' && backgroundImage.url) {
      imageUrl = backgroundImage.url
    }
  }

  const overlayClass =
    overlay === 'dark' ? 'bg-black/50' : overlay === 'light' ? 'bg-white/20' : ''

  return (
    <section
      className="relative w-full min-h-[80vh] bg-cover bg-center bg-fixed flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
      data-theme="dark"
    >
      {overlay !== 'none' && <div className={`absolute inset-0 z-10 ${overlayClass}`}></div>}

      <div className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto animate-fadeInUp">
        {title && (
          <h1
            className={`${titleFont} text-5xl font-bold uppercase text-white mb-4 drop-shadow-lg tracking-wider`}
          >
            {title}
          </h1>
        )}
        {subtitle && <h2 className="text-4xl font-semibold mb-6 drop-shadow-md">{subtitle}</h2>}

        {description && (
          <p className="text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">{description}</p>
        )}

        {cta && (
          <a
            href={cta.url}
            className="inline-block px-8 py-3 bg-red-600 text-white font-semibold rounded transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-2xl uppercase tracking-wider text-sm"
          >
            {cta.text}
          </a>
        )}
      </div>
    </section>
  )
}
