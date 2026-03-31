import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const payload = await getPayload({ config: configPromise })

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get transactions within date range
    const transactions = await payload.find({
      collection: 'transactions',
      where: {
        transactionDate: {
          greater_than_equal: startDateStr,
          less_than_equal: endDateStr,
        },
      },
      limit: 1000,
    })

    // Group transactions by date and calculate total (purchase price + tax)
    const dailyIncome: Record<string, number> = {}
    transactions.docs.forEach((transaction) => {
      if (transaction.transactionDate) {
        const date = transaction.transactionDate
        const total = (transaction.purchasePrice || 0) + (transaction.taxAmount || 0)
        dailyIncome[date] = (dailyIncome[date] || 0) + total
      }
    })

    // Calculate total income
    const totalPurchasePrice = transactions.docs.reduce((sum, transaction) => sum + (transaction.purchasePrice || 0), 0)
    const totalTaxAmount = transactions.docs.reduce((sum, transaction) => sum + (transaction.taxAmount || 0), 0)
    const totalIncome = totalPurchasePrice + totalTaxAmount

    // Create chart data
    const chartData = Object.entries(dailyIncome)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, amount]) => ({
        date,
        amount: Number(amount.toFixed(2)),
      }))

    return Response.json({
      totalPurchasePrice: Number(totalPurchasePrice.toFixed(2)),
      totalTaxAmount: Number(totalTaxAmount.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      transactionCount: transactions.docs.length,
      days,
      chartData,
    })
  } catch (error) {
    console.error('Error fetching income data:', error)
    return Response.json({ error: 'Failed to fetch income data' }, { status: 500 })
  }
}
