import { getClientSideURL } from '@/utilities/getURL'

/**
 * Normalizes media URLs from various Payload formats to a consistent format
 *
 * With staticURL: '/media' configured in Media collection:
 * - Payload automatically serves files at /media/filename
 * - Database stores: /media/filename.jpg
 * - This utility ensures proper base URL for full paths
 *
 * @param input - URL string, Media object, or undefined
 * @param cacheTag - Optional cache tag to append to URL
 * @returns Normalized URL
 */
export const normalizeMediaUrl = (
  input: string | { url?: string | null } | undefined | null,
  cacheTag?: string | null,
): string => {
  if (!input) return ''

  // Extract URL from object if needed
  let url = typeof input === 'string' ? input : input?.url

  if (!url) return ''

  // If it's already a full URL (http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return cacheTag ? `${url}?${encodeURIComponent(cacheTag)}` : url
  }

  // For relative paths, prepend base URL
  const baseUrl = getClientSideURL()
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  return cacheTag ? `${fullUrl}?${encodeURIComponent(cacheTag)}` : fullUrl
}
