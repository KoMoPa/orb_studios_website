'use client'

import React, { useEffect, useState } from 'react'
import './analytics-dashboard.scss'

interface DoorCode {
  id: string
  location: string
  code: string
  description?: string
}

interface MonthlyRenter {
  id: string
  name: string
  email: string
  bandName?: string
  hoursUsed: number
  hoursCancelled: number
}

interface ChartPoint {
  date: string
  amount: number
}

interface IncomeData {
  totalPurchasePrice: number
  totalTaxAmount: number
  totalIncome: number
  transactionCount: number
  chartData: ChartPoint[]
}

const AnalyticsDashboard: React.FC = () => {
  const [doorCodes, setDoorCodes] = useState<DoorCode[]>([])
  const [monthlyRenters, setMonthlyRenters] = useState<MonthlyRenter[]>([])
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doorsRes, rentersRes, incomeRes] = await Promise.all([
          fetch('/api/analytics/door-codes'),
          fetch('/api/analytics/monthly-renters'),
          fetch('/api/analytics/income?days=30'),
        ])

        if (doorsRes.ok) setDoorCodes((await doorsRes.json()).codes || [])
        if (rentersRes.ok) setMonthlyRenters((await rentersRes.json()).renters || [])
        if (incomeRes.ok) setIncomeData(await incomeRes.json())
      } catch (err) {
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="analytics-dashboard">Loading...</div>

  return (
    <div className="analytics-dashboard">
      <div className="analytics-dashboard__quick-actions">
        <a href="/admin/invoice-generator" className="analytics-dashboard__quick-action-btn">
          <span className="analytics-dashboard__quick-action-icon">📄</span>
          <span>Generate Invoice</span>
        </a>
      </div>

      {doorCodes.length > 0 && (
        <div className="analytics-dashboard__section">
          <h3 className="analytics-dashboard__section-title">🔑 Door Codes</h3>
          <div className="analytics-dashboard__codes-grid">
            {doorCodes.map((code) => (
              <div key={code.id} className="analytics-dashboard__code-card">
                <div className="analytics-dashboard__code-location">{code.location}</div>
                <div className="analytics-dashboard__code-value">{code.code}</div>
                {code.description && (
                  <div className="analytics-dashboard__code-description">{code.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {monthlyRenters.length > 0 && (
        <div className="analytics-dashboard__section">
          <h3 className="analytics-dashboard__section-title">👥 Monthly Renters</h3>
          <div className="analytics-dashboard__renters-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Band</th>
                  <th>Hours Used</th>
                  <th>Hours Cancelled</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRenters.map((renter) => (
                  <tr key={renter.id}>
                    <td>{renter.name}</td>
                    <td>{renter.bandName || '—'}</td>
                    <td>{renter.hoursUsed}</td>
                    <td>{renter.hoursCancelled}</td>
                    <td>{renter.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {incomeData && (
        <div className="analytics-dashboard__section">
          <h3 className="analytics-dashboard__section-title">💰 Income (Last 30 Days)</h3>
          <div className="analytics-dashboard__income-summary">
            <div className="analytics-dashboard__income-card">
              <div className="analytics-dashboard__income-label">Revenue</div>
              <div className="analytics-dashboard__income-value">
                ${incomeData.totalPurchasePrice.toFixed(2)}
              </div>
              <div className="analytics-dashboard__income-subtext">Before tax</div>
            </div>
            <div className="analytics-dashboard__income-card">
              <div className="analytics-dashboard__income-label">Total Tax</div>
              <div className="analytics-dashboard__income-value">
                ${incomeData.totalTaxAmount.toFixed(2)}
              </div>
              <div className="analytics-dashboard__income-subtext">HST collected</div>
            </div>
            <div className="analytics-dashboard__income-card analytics-dashboard__income-card--total">
              <div className="analytics-dashboard__income-label">Total Income</div>
              <div className="analytics-dashboard__income-value">
                ${incomeData.totalIncome.toFixed(2)}
              </div>
              <div className="analytics-dashboard__income-subtext">
                {incomeData.transactionCount} transactions
              </div>
            </div>
          </div>

          {incomeData.chartData.length > 0 && (
            <div className="analytics-dashboard__chart">
              <div className="analytics-dashboard__chart-title">Daily Income</div>
              <div className="analytics-dashboard__chart-container">
                {incomeData.chartData.map((point, idx) => {
                  const max = Math.max(...incomeData.chartData.map((p) => p.amount))
                  const height = max > 0 ? (point.amount / max) * 100 : 0
                  return (
                    <div key={idx} className="analytics-dashboard__chart-bar-wrapper">
                      <div
                        className="analytics-dashboard__chart-bar"
                        style={{ height: `${height}%` }}
                        title={`${point.date}: $${point.amount.toFixed(2)}`}
                      />
                      <div className="analytics-dashboard__chart-label">{point.date}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard
