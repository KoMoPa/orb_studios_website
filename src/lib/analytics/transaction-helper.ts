import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export interface TransactionData {
  transactionDate: string // ISO date string (YYYY-MM-DD)
  purchasePrice: number
  taxAmount: number
}

/**
 * Log a transaction to the Transactions collection
 * Useful for tracking income from bookings and other sources
 */
export async function logTransaction(data: TransactionData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const transaction = await payload.create({
      collection: 'transactions',
      data: {
        transactionDate: data.transactionDate,
        purchasePrice: data.purchasePrice,
        taxAmount: data.taxAmount,
      },
    })

    console.log(`Transaction logged: ${transaction.id}`)
    return transaction
  } catch (error) {
    console.error('Error logging transaction:', error)
    throw error
  }
}

/**
 * Get total income (purchase price + tax) for a date range
 */
export async function getTotalIncome(startDate: Date, endDate: Date) {
  try {
    const payload = await getPayload({ config: configPromise })

    const transactions = await payload.find({
      collection: 'transactions',
      where: {
        transactionDate: {
          greater_than_equal: startDate.toISOString().split('T')[0],
          less_than_equal: endDate.toISOString().split('T')[0],
        },
      },
      limit: 1000,
    })

    const total = transactions.docs.reduce(
      (sum, transaction) => sum + ((transaction.purchasePrice || 0) + (transaction.taxAmount || 0)),
      0,
    )
    return Number(total.toFixed(2))
  } catch (error) {
    console.error('Error calculating total income:', error)
    throw error
  }
}

/**
 * Get income breakdown (purchase price vs tax)
 */
export async function getIncomeBreakdown(startDate: Date, endDate: Date) {
  try {
    const payload = await getPayload({ config: configPromise })

    const transactions = await payload.find({
      collection: 'transactions',
      where: {
        transactionDate: {
          greater_than_equal: startDate.toISOString().split('T')[0],
          less_than_equal: endDate.toISOString().split('T')[0],
        },
      },
      limit: 1000,
    })

    const totalPurchasePrice = transactions.docs.reduce(
      (sum, transaction) => sum + (transaction.purchasePrice || 0),
      0,
    )
    const totalTaxAmount = transactions.docs.reduce(
      (sum, transaction) => sum + (transaction.taxAmount || 0),
      0,
    )

    return {
      purchasePrice: Number(totalPurchasePrice.toFixed(2)),
      taxAmount: Number(totalTaxAmount.toFixed(2)),
      total: Number((totalPurchasePrice + totalTaxAmount).toFixed(2)),
    }
  } catch (error) {
    console.error('Error getting income breakdown:', error)
    throw error
  }
}
