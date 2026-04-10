import React from 'react'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import { FormBlock } from '@/blocks/Form/Component'

type MonthlyCard = {
  title: string
  description: string
  type: 'link' | 'action' | 'form'
  link?: {
    url: string
    label: string
  }
}

type MonthlyCardsBlockProps = {
  title?: string
  cards: MonthlyCard[]
  isDark?: boolean
  form?: Form
}

export const MonthlyCardsBlock: React.FC<MonthlyCardsBlockProps> = ({
  form,
  title = 'Monthly Rentals',
  cards,
  isDark = false,
}) => {
  const cardBgColor = isDark ? 'rgba(51, 51, 51, 0.3)' : 'var(--light)'
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb'
  const textColor = isDark ? '#f9f9f9' : 'var(--dark)'
  const secondaryTextColor = isDark ? '#b3b3b3' : '#4b5563'

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: isDark ? 'transparent' : 'var(--light)' }}>
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 
            className="text-4xl font-bold uppercase mb-12 text-center tracking-wide"
            style={{ color: textColor, fontFamily: '"Rubik Doodle Shadow", sans-serif' }}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              style={{ 
                backgroundColor: cardBgColor,
                borderTop: '4px solid #fa0000',
                border: `1px solid ${cardBorderColor}`,
                backdropFilter: isDark ? 'blur(10px)' : 'none',
              }}
            >
              <div className="p-8 h-full flex flex-col">
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: textColor }}
                >
                  {card.title}
                </h3>
                <p 
                  className="mb-6 grow"
                  style={{ color: secondaryTextColor }}
                >
                  {card.description}
                </p>

                {card.type === 'link' && card.link && (
                  <a
                    href={card.link.url}
                    className="btn-console btn-console--red"
                  >
                    {card.link.label}
                  </a>
                )}

                {card.type === 'action' && card.link && (
                  <a
                    href={card.link.url}
                    className="btn-console btn-console--yellow"
                  >
                    {card.link.label}
                  </a>
                )}

                {card.type === 'form' && form && (
                  <FormBlock form={form} enableIntro={false} isEmbedded={true} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
