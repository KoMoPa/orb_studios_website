import config from '@/payload/config'
import { Payload } from 'payload'

let cached: Payload | null = null

export const getPayload = async (): Promise<Payload> => {
  if (!cached) {
    const { getPayload: getPayloadInstance } = await import('payload')
    cached = await getPayloadInstance({ config })
  }
  return cached
}
