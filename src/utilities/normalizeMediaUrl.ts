/**
 * Normalizes media URLs from various Payload formats to a consistent format
 *
 * With staticURL: '/media' configured in Media collection:
 * - Payload automatically serves files at /media/filename
 * - Database stores: /media/filename.jpg
 * - Relative paths are returned as-is to work correctly with Next.js Image optimization
 *
 * @param input - URL string, Media object, or undefined
 * @param cacheTag - Optional cache tag to append to URL (ignored for SSR compatibility)
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

  // For relative paths, return as-is to ensure Next.js Image optimization works correctly during SSR
  // Relative paths like /media/image.jpg will be optimized by Next.js Image automatically
  return url
}
