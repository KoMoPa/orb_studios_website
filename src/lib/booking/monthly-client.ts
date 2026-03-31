/**
 * Calculate available hours for a monthly client
 * Monthly allocation: 24 hours
 * Reset: Anniversary of monthlyStartDate
 */
export function getAvailableMonthlyHours(
  monthlyStartDate: string | Date,
  monthlyHoursUsed: number,
  monthlyHoursCancelled: number
): number {
  const startDate = new Date(monthlyStartDate);
  const today = new Date();

  // Calculate the anniversary date this month/year
  let anniversaryThisYear = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());

  // If anniversary hasn't occurred yet this year, use last year's anniversary
  if (anniversaryThisYear > today) {
    anniversaryThisYear = new Date(today.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
  }

  // The current monthly period started on the last anniversary
  const usedInCurrentPeriod = monthlyHoursUsed - monthlyHoursCancelled;
  const MONTHLY_ALLOCATION = 24;
  const available = Math.max(0, MONTHLY_ALLOCATION - usedInCurrentPeriod);

  return available;
}

/**
 * Calculate overage cost for hours beyond the 24-hour monthly allocation
 * Overage is charged at 50% off the rehearsal hourly rate
 */
export function getMonthlyOverageCost(
  hoursRequested: number,
  availableHours: number,
  rehearsalHourlyRate: number
): { totalCost: number; monthlyIncluded: number; overageHours: number; overageCost: number } {
  const monthlyIncluded = Math.min(hoursRequested, availableHours);
  const overageHours = Math.max(0, hoursRequested - availableHours);
  const overageRate = rehearsalHourlyRate * 0.5; // 50% off
  const overageCost = overageHours * overageRate;

  return {
    totalCost: overageCost,
    monthlyIncluded,
    overageHours,
    overageCost,
  };
}

/**
 * Check if a client should have their monthly hours reset
 * Returns true if the anniversary has passed since last reset
 */
export function shouldResetMonthlyHours(
  monthlyStartDate: string | Date,
  lastResetDate?: string | Date
): boolean {
  const startDate = new Date(monthlyStartDate);
  const today = new Date();

  let currentAnniversary = new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate());

  if (currentAnniversary > today) {
    currentAnniversary = new Date(today.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
  }

  if (!lastResetDate) {
    return true;
  }

  const lastReset = new Date(lastResetDate);
  return currentAnniversary > lastReset;
}
