'use client'

import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import { DropdownGroup } from '@/components/Dropdown/Group'

type Props = FAQBlockProps & {
  disableInnerContainer?: boolean
}

export const FAQBlock: React.FC<Props> = (props) => {
  const { title, faqs = [] } = props

  return (
    <section className="w-full py-16 px-4" style={{ backgroundColor: 'var(--light)' }}>
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-4xl font-bold uppercase mb-12 tracking-wider" style={{ color: 'var(--dark)' }}>
            {title}
          </h2>
        )}

        <DropdownGroup faqs={faqs as any} />
      </div>
    </section>
  )
}
