import type { Config } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

type Global = keyof Config['globals']

// Cache instances to avoid creating new unstable_cache on each calls
const globalCaches = new Map<string, Function>()
const collectionCaches = new Map<string, Function>()
const countCaches = new Map<string, Function>()
const documentCaches = new Map<string, Function>()

/**
 * Get a Payload instance - deduplicates within a single render cycle using React's cache()
 * This avoids JSON serialization errors from unstable_cache with circular object references
 */
export const getCachedPayloadInstance = cache(
  async () => getPayload({ config: configPromise }),
)

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getCachedPayloadInstance()

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) => {
  const key = `${slug}_${depth}`
  if (!globalCaches.has(key)) {
    globalCaches.set(
      key,
      unstable_cache(async () => getGlobal(slug, depth), [key], {
        tags: [`global_${slug}`],
      }),
    )
  }
  return globalCaches.get(key)!
}

/**
 * Fetch collection items with caching to prevent repeated schema pulls
 */
async function getCollectionItems(
  collection: string,
  limit: number = 100,
  sort: string | null = null,
  select: Record<string, boolean> = {},
) {
  const payload = await getCachedPayloadInstance()

  return await payload.find({
    collection: collection as any,
    limit,
    ...(sort && { sort }),
    overrideAccess: false,
    select,
  })
}

/**
 * Returns a cached version of collection queries
 */
export const getCachedCollectionItems = (
  collection: string,
  limit: number = 100,
  sort: string | null = null,
  select: Record<string, boolean> = {},
) => {
  const key = `collection_${collection}_${JSON.stringify(select)}`
  if (!collectionCaches.has(key)) {
    collectionCaches.set(
      key,
      unstable_cache(
        async () => getCollectionItems(collection, limit, sort, select),
        [key],
        {
          tags: [`collection_${collection}`],
        },
      ),
    )
  }
  return collectionCaches.get(key)!
}

/**
 * Fetch collection items with caching to prevent repeated schema pulls
 * Used for generateStaticParams and similar functions
 */
async function getCollectionItemsForStaticGeneration(
  collection: string,
  limit: number = 1000,
  select: Record<string, boolean> = {},
) {
  const payload = await getCachedPayloadInstance()

  return await payload.find({
    collection: collection as any,
    draft: false,
    limit,
    overrideAccess: false,
    pagination: false,
    select,
  })
}

/**
 * Returns a cached version of collection queries for static generation
 * Cache instances are reused to prevent creating new unstable_cache calls
 */
export const getCachedCollectionItemsForStaticGeneration = (
  collection: string,
  limit: number = 1000,
  select: Record<string, boolean> = {},
) => {
  const key = `static_collection_${collection}_${JSON.stringify(select)}`
  if (!collectionCaches.has(key)) {
    collectionCaches.set(
      key,
      unstable_cache(
        async () => getCollectionItemsForStaticGeneration(collection, limit, select),
        [key],
        {
          tags: [`collection_${collection}`],
          revalidate: 3600, // 1 hour
        },
      ),
    )
  }
  return collectionCaches.get(key)!
}

/**
 * Get collection count without fetching all docs
 */
async function getCollectionCount(collection: string) {
  const payload = await getCachedPayloadInstance()

  return await payload.count({
    collection: collection as any,
    overrideAccess: false,
  })
}

/**
 * Returns a cached version of collection count queries
 */
export const getCachedCollectionCount = (collection: string) => {
  const key = `count_${collection}`
  if (!countCaches.has(key)) {
    countCaches.set(
      key,
      unstable_cache(async () => getCollectionCount(collection), [key], {
        tags: [`collection_${collection}`],
        revalidate: 3600, // 1 hour
      }),
    )
  }
  return countCaches.get(key)!
}

/**
 * Fetch a single document by where clause with caching
 */
async function getDocumentByWhere(
  collection: string,
  where: Record<string, any>,
  draft: boolean = false,
  depth: number = 0,
) {
  const payload = await getCachedPayloadInstance()

  return await payload.find({
    collection: collection as any,
    where,
    draft,
    limit: 1,
    overrideAccess: draft,
    depth,
  })
}

/**
 * Get a single document with caching to prevent repeated schema pulls
 */
export const getCachedDocument = (
  collection: string,
  where: Record<string, any>,
  draft: boolean = false,
  depth: number = 0,
) => {
  const key = `doc_${collection}_${JSON.stringify(where)}_${draft}_${depth}`
  if (!documentCaches.has(key)) {
    documentCaches.set(
      key,
      unstable_cache(
        async () => getDocumentByWhere(collection, where, draft, depth),
        [key],
        {
          tags: [`collection_${collection}`],
          revalidate: 3600,
        },
      ),
    )
  }
  return documentCaches.get(key)!
}
