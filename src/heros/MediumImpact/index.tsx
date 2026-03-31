import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const extractTextFromRichText = (richText: any): string => {
  if (!richText?.root?.children) return ''
  
  let text = ''
  const traverse = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.type === 'text') {
        text += node.text
      } else if (node.children && Array.isArray(node.children)) {
        traverse(node.children)
      }
    })
  }
  
  traverse(richText.root.children)
  return text
}

const splitTextIntoTitleAndSubtitle = (text: string): { title: string; subtitle: string } => {
  const firstPeriod = text.indexOf('.')
  if (firstPeriod > 0) {
    return {
      title: text.substring(0, firstPeriod),
      subtitle: text.substring(firstPeriod + 1).trim(),
    }
  }
  return { title: text, subtitle: '' }
}

export const MediumImpactHero: React.FC<Page['hero'] & { overlayColor?: string; textColor?: string }> = ({ 
  links, 
  richText,
  overlayColor = 'bg-red-900/95',
  textColor = 'text-white',
}) => {
  const heroText = extractTextFromRichText(richText)
  const { title, subtitle } = splitTextIntoTitleAndSubtitle(heroText)

  return (
    <div
      className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url(/media/controlroom1.jpg)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay - customizable */}
      <div className={`absolute inset-0 ${overlayColor}`} />

      {/* Content */}
      <div className="relative z-10 w-full px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          {title && (
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-none tracking-tight ${textColor} drop-shadow-lg mb-4`}
              style={{
                lineHeight: '1.1',
                wordBreak: 'break-word',
              }}
            >
              {title}
            </h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-light leading-relaxed ${textColor} drop-shadow-lg`}
              style={{
                wordBreak: 'break-word',
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Links */}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 justify-center mt-8">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} className="btn-console btn-console--red" />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
