'use client'

import type { ArrayFieldRowLabel } from 'payload'

export const RowLabel: ArrayFieldRowLabel = ({ data, index }) => {
  if (data?.type === 'collectionDropdown') {
    return (
      data?.collectionDropdown?.label ||
      `Collection Dropdown ${String(index ? index + 1 : '')}`
    )
  }

  return (
    data?.link?.label ||
    data?.link?.reference?.value?.title ||
    `Item ${String(index ? index + 1 : '')}`
  )
}