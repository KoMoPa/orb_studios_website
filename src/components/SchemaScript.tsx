import React from 'react'

interface SchemaProps {
  schema: Record<string, any>
}

/**
 * SchemaScript component for injecting JSON-LD structured data
 * Used to add rich snippets for Google, Bing, and other search engines
 */
export const SchemaScript: React.FC<SchemaProps> = ({ schema }) => {
  const jsonLd = JSON.stringify(schema)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      suppressHydrationWarning
    />
  )
}

/**
 * Multiple schemas can be combined using @graph
 */
export const MultiSchemaScript: React.FC<{ schemas: Record<string, any>[] }> = ({ schemas }) => {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  })

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      suppressHydrationWarning
    />
  )
}
