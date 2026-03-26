import { getClientSideURL } from '@/utilities/getURL'

/**
 * Normalizes media URLs from various Payload formats to a consistent format
 *
 * Handles:
 * - `/media/filename.jpg` (relative path)
 * - `/api/media/file/filename.jpg` (API path)
 * - `https://domain.com/media/filename.jpg` (full URL)
 * - Media objects with url property
 *
 * @param input - URL string, Media object, or undefined
 * @param cacheTag - Optional cache tag to append to URL
 * @returns Normalized URL ready for use in img/Image components
 */
export const normalizeMediaUrl = (
  input: string | { url?: string | null } | undefined | null,
  cacheTag?: string | null,
): string => {
  if (!input) return ''

  // Extract URL from object if needed
  let urlString = typeof input === 'string' ? input : input?.url

  if (!urlString) return ''

  // Remove /api prefix if present (convert /api/media/file/... to /media/...)
  if (urlString.includes('/api/media/file/')) {
    urlString = urlString.replace('/api/media/file/', '/media/')
  }

  // If it's already a full URL (http/https), return as-is with cache tag
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    return cacheTag ? `${urlString}?${encodeURIComponent(cacheTag)}` : urlString
  }

  // If it's a relative path starting with /media, prepend base URL
  if (urlString.startsWith('/media')) {
    const baseUrl = getClientSideURL()
    return cacheTag ? `${baseUrl}${urlString}?${encodeURIComponent(cacheTag)}` : `${baseUrl}${urlString}`
  }

  // Fallback: treat as relative path and prepend /media/ if needed
  if (!urlString.startsWith('/')) {
    urlString = `/media/${urlString}`
  }

  const baseUrl = getClientSideURL()
  return cacheTag ? `${baseUrl}${urlString}?${encodeURIComponent(cacheTag)}` : `${baseUrl}${urlString}`
}
