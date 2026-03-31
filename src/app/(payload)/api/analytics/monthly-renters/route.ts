import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get all monthly clients with their hours used
    const clients = await payload.find({
      collection: 'clients',
      where: {
        isMonthlyClient: {
          equals: true,
        },
      },
    })

    const monthlyRenters = clients.docs.map((client) => ({
      id: client.id,
      name: client.name || client.email,
      email: client.email,
      bandName: client.bandName,
      hoursUsed: client.monthlyHoursUsed || 0,
      hoursCancelled: client.monthlyHoursCancelled || 0,
      monthlyStartDate: client.monthlyStartDate,
    }))

    return Response.json({
      total: monthlyRenters.length,
      renters: monthlyRenters,
    })
  } catch (error) {
    console.error('Error fetching monthly renters:', error)
    return Response.json({ error: 'Failed to fetch monthly renters' }, { status: 500 })
  }
}
