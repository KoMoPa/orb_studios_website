'use client'

import React, { useState, useEffect } from 'react'

import { Dropdown, DropdownData } from '@/components/Dropdown'
import RichText from '@/components/RichText'

export type Props = {
  faqs?: DropdownData[]
}

export const DropdownGroup: React.FC<Props> = (props) => {
  const { faqs: initialFaqs } = props
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<DropdownData[]>(initialFaqs || [])
  const [isLoading, setIsLoading] = useState(!initialFaqs || initialFaqs.length === 0)

  useEffect(() => {
    // If FAQs are provided, use those
    if (initialFaqs && initialFaqs.length > 0) {
      setFaqs(initialFaqs)
      setIsLoading(false)
      return
    }

    // Otherwise fetch from API
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faq?limit=0')
        if (response.ok) {
          const data = await response.json()
          setFaqs(data.docs || [])
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFaqs()
  }, [initialFaqs])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {faqs?.map((item, index) => {
        return (
          <div key={item.id || index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded"
            >
              <span className="text-lg font-semibold text-left text-gray-900 dark:text-white">
                {item.question}
              </span>
              <span
                className="text-2xl font-bold transition-transform duration-300 text-gray-900 dark:text-white"
                style={{
                  transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              >
                +
              </span>
            </button>

            {openIndex === index && (
              <div
                className="px-6 py-4 border-t border-gray-300 dark:border-gray-600 border-l border-r border-b rounded-b"
                style={{ backgroundColor: 'transparent' }}
              >
                <div className="text-base leading-relaxed text-gray-900 dark:text-white">
                  {item.answer && <RichText data={item.answer} enableGutter={false} />}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
