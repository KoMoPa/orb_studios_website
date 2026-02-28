import type { Metadata } from 'next'

import { Payload } from 'payload'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SERVER_URL?: string
      PAYLOAD_SECRET?: string
      DATABASE_URI?: string
      PAYLOAD_PUBLIC_APP_URL?: string
    }
  }
}
