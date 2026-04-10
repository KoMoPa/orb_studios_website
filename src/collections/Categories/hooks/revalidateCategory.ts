import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import type { Category } from '../../../payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating posts page due to category change')
  revalidatePath('/posts')
  revalidateTag('posts-sitemap', 'default')
  return
}

export const revalidateDeleteCategory: CollectionAfterDeleteHook<Category> = ({ req: { payload } }) => {
  payload.logger.info('Revalidating posts page after category deletion')
  revalidatePath('/posts')
  revalidateTag('posts-sitemap', 'default')
  return
}
