import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'

import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { Settings } from './globals/Settings'

const isProduction = process.env.NODE_ENV === 'production'

export default buildConfig({
  debug: true,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },
  collections: [Users, Pages, Posts, Media],
  globals: [Navigation, Footer, Settings],
  serverURL: isProduction
    ? process.env.PAYLOAD_PUBLIC_SERVER_URL || ''
    : process.env.PAYLOAD_PUBLIC_SERVERLESS_URL || 'http://localhost:3000',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(__dirname, 'generated-types.ts'),
  },
})

