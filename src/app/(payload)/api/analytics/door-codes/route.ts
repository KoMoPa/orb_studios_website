import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get all door codes
    const doorCodes = await payload.find({
      collection: 'doorCodes',
      sort: 'location',
    })

    return Response.json({
      total: doorCodes.docs.length,
      codes: doorCodes.docs.map((code) => ({
        id: code.id,
        location: code.location,
        code: code.code,
        description: code.description,
      })),
    })
  } catch (error) {
    console.error('Error fetching door codes:', error)
    return Response.json({ error: 'Failed to fetch door codes' }, { status: 500 })
  }
}
