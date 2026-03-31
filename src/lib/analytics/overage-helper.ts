import { getPayload } from 'payload'
import configPromise from '@/payload.config'

const HST_RATE = 0.13

export interface OverageCalculation {
  hasOverage: boolean
  overageHours: number
  overageAmount: number
  totalOverageWithHST: number
}

/**
 * Calculate overage charges for a monthly client booking
 * @param clientId - Payload client ID
 * @param newBookingHours - Hours of the new booking
 * @param hourlyRate - The hourly rate for this specific room/type
 * @returns Overage calculation details
 */
export async function calculateMonthlyOverage(
  clientId: string,
  newBookingHours: number,
  hourlyRate: number,
): Promise<OverageCalculation> {
  const payload = await getPayload({ config: configPromise })

  try {
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    // Get client's monthly allocation
    const monthlyHoursIncluded = client.monthlyHoursIncluded || 20 // Default to 20 hours if not set
    const currentHoursUsed = (client.monthlyHoursUsed || 0) - (client.monthlyHoursCancelled || 0)
    const overageRatePercentage = client.overageRatePercentage || 100

    // Calculate total hours after this booking
    const totalHoursAfterBooking = currentHoursUsed + newBookingHours

    // Check if there's overage
    if (totalHoursAfterBooking <= monthlyHoursIncluded) {
      return {
        hasOverage: false,
        overageHours: 0,
        overageAmount: 0,
        totalOverageWithHST: 0,
      }
    }

    // Calculate how many hours are over the limit
    const overageHours = totalHoursAfterBooking - monthlyHoursIncluded
    const overageRate = hourlyRate * (overageRatePercentage / 100)
    const overageSubtotal = overageHours * overageRate
    const overageHST = overageSubtotal * HST_RATE
    const totalOverage = overageSubtotal + overageHST

    return {
      hasOverage: true,
      overageHours: Number(overageHours.toFixed(2)),
      overageAmount: Number(overageSubtotal.toFixed(2)),
      totalOverageWithHST: Number(totalOverage.toFixed(2)),
    }
  } catch (error) {
    console.error('Error calculating monthly overage:', error)
    // Return no overage if there's an error fetching client
    return {
      hasOverage: false,
      overageHours: 0,
      overageAmount: 0,
      totalOverageWithHST: 0,
    }
  }
}

/**
 * Log an overage transaction for a monthly client
 */
export async function logOverageTransaction(
  clientId: string,
  clientEmail: string,
  clientName: string,
  rentalType: string,
  overageHours: number,
  overageAmountWithTax: number,
  bookingId: string,
): Promise<void> {
  const payload = await getPayload({ config: configPromise })

  try {
    // Calculate purchase price and tax from total
    const overagePurchasePrice = overageAmountWithTax / 1.13 // Remove HST
    const overageTaxAmount = overageAmountWithTax - overagePurchasePrice

    const today = new Date().toISOString().split('T')[0]

    await payload.create({
      collection: 'transactions',
      data: {
        transactionDate: today,
        purchasePrice: Number(overagePurchasePrice.toFixed(2)),
        taxAmount: Number(overageTaxAmount.toFixed(2)),
      },
    })
    console.log(`Overage transaction logged: ${clientName} - ${overageHours} hours`)
  } catch (error) {
    console.error('Error logging overage transaction:', error)
    throw error
  }
}
