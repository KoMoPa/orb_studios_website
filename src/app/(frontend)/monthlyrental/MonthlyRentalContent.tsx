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
  // Filter out checkbox fields from the form
  const filteredForm = form
    ? {
        ...form,
        fields: form.fields?.filter((field) => field.blockType !== 'checkbox') || [],
      }
    : undefined

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
            url: '/api/media/file/controlroom1.jpg',
          }}
          overlayOpacity={0.4}
          overlayColor="#8B1A1A"
          richText={richTextData}
          minHeight={1800}
        />
      </article>
      {filteredForm && <FormBlock form={filteredForm} enableIntro={false} />}
    </ParallaxProvider>
  )
}
