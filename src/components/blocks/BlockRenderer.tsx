'use client'

import { blockComponents } from './index'

export interface Block {
  blockType: string
  [key: string]: any
}

interface BlockRendererProps {
  blocks: Block[]
}

/**
 * Renders an array of blocks from Payload by mapping block types to React components
 * This is used when rendering pages that have block-based content
 */
export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const blockType = block.blockType as keyof typeof blockComponents
        const Component = blockComponents[blockType]

        if (!Component) {
          console.warn(`Block type "${blockType}" not found in blockComponents`)
          return null
        }

        return <Component key={block.id || index} {...block} />
      })}
    </>
  )
}
