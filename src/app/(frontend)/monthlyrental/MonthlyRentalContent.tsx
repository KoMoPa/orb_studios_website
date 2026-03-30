'use client'

import React from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'
import { ParallaxBlock } from '@/blocks/ParallaxBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

interface MonthlyRentalContentProps {
  form?: Form
  richTextData: DefaultTypedEditorState
}

export const MonthlyRentalContent: React.FC<MonthlyRentalContentProps> = ({
  form,
  richTextData,
}) => {
  return (
    <ParallaxProvider>
      <article className="pt-16 pb-24">
        <ParallaxBlock
          title="All-Inclusive Monthly Rental"
          media={{
            id: '1',
            alt: 'Control Room Setup',
            filename: 'controlroom1.jpg',
            mimeType: 'image/jpeg',
            filesize: 123456,
            width: 1920,
            height: 1154,
            url: '/media/controlroom1.jpg',
          }}
          overlayOpacity={0.4}
          overlayColor="#8B1A1A"
          richText={richTextData}
          minHeight={1800}
        />
      </article>
      {form && <FormBlock form={form} enableIntro={false} />}
    </ParallaxProvider>
  )
}
