/**
 * Payload Query Helpers
 * Reusable functions for fetching data from Payload CMS
 */

import { getPayload } from './getPayload'

/**
 * Get all published pages
 */
export async function getPages() {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: {
      publishedAt: {
        exists: true,
      },
    },
    sort: '-publishedAt',
  })
  return result.docs
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0]
}

/**
 * Get all published posts
 */
export async function getPosts(limit = 10) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'posts',
    where: {
      publishedAt: {
        exists: true,
      },
    },
    sort: '-publishedAt',
    limit,
  })
  return result.docs
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0]
}

/**
 * Get navigation global
 */
export async function getNavigation() {
  const payload = await getPayload()
  return await payload.findGlobal({
    slug: 'navigation',
  })
}

/**
 * Get footer global
 */
export async function getFooter() {
  const payload = await getPayload()
  return await payload.findGlobal({
    slug: 'footer',
  })
}

/**
 * Get settings global
 */
export async function getSettings() {
  const payload = await getPayload()
  return await payload.findGlobal({
    slug: 'settings',
  })
}

/**
 * Get media by ID
 */
export async function getMedia(id: string) {
  const payload = await getPayload()
  return await payload.findByID({
    collection: 'media',
    id,
  })
}
