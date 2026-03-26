'use client'

import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { normalizeMediaUrl } from '@/utilities/normalizeMediaUrl'

type CustomHeroProps = {
  backgroundImage?: any
  title?: string
  subtitle?: string
  description?: string
  cta?: {
    text: string
    url: string
  }
  overlay?: 'dark' | 'light' | 'none' | string
  overlayOpacity?: number
  titleFont?: string
  alignment?: 'center' | 'left'
  minHeight?: string
}

export const CustomHero: React.FC<CustomHeroProps> = ({
  backgroundImage,
  title,
  subtitle,
  description,
  cta,
  overlay = 'dark',
  overlayOpacity = 50,
  titleFont = 'glitch',
  alignment = 'center',
  minHeight = '80vh',
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const imageUrl = normalizeMediaUrl(backgroundImage)

  const overlayClass = overlay === 'dark' 
    ? 'bg-black' 
    : overlay === 'light' 
    ? 'bg-white' 
    : !overlay || overlay === 'none'
    ? ''
    : overlay

  const isGradient = overlay && (overlay.includes('gradient') || overlay.includes('from-'))

  return (
    <section
      className={`relative w-full flex items-center overflow-hidden`}
      style={{ 
        minHeight,
      }}
      data-theme="dark"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {overlay !== 'none' && !isGradient && (
        <div 
          className={`absolute inset-0 z-10 ${overlayClass}`}
          style={{ opacity: overlayOpacity / 100 }}
        ></div>
      )}
      {isGradient && (
        <div 
          className={`absolute inset-0 z-10 bg-gradient-to-r ${overlay}`}
          style={{ opacity: overlayOpacity / 100 }}
        ></div>
      )}

      <div className={`relative z-20 w-full max-w-5xl px-4 py-12 ${alignment === 'left' ? 'text-left' : 'mx-auto text-center'}`}>
        {title && (
          <h1
            className={`${titleFont} text-5xl font-bold uppercase text-white mb-4 drop-shadow-lg tracking-wider`}
          >
            {title}
          </h1>
        )}
        {subtitle && <h2 className="text-4xl font-semibold mb-6 drop-shadow-md text-white">{subtitle}</h2>}

        {description && (
          <p className="text-lg mb-8 max-w-2xl drop-shadow-md text-white">
            {description}
          </p>
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
