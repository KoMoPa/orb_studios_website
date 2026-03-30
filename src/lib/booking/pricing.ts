import { PricingBreakdown, RentalType } from './types';

const HST_RATE = 0.13; // 13% HST (Ontario)

/**
 * Calculate booking price based on hourly rate and duration
 * Includes 13% HST
 */
export function calculatePrice(
    hourlyRate: number,
    durationHours: number,
    isMonthlyClient: boolean = false
): PricingBreakdown {
    let subtotal = hourlyRate * durationHours;
    let monthlyDiscount = 0;

    // Apply monthly discount if applicable
    if (isMonthlyClient) {
        // Monthly clients get 20% discount on hourly bookings
        monthlyDiscount = subtotal * 0.2;
        subtotal -= monthlyDiscount;
    }

    // Calculate HST on subtotal
    const hst = subtotal * HST_RATE;
    const total = subtotal + hst;

    return {
        rentalType: 'hourly-recording' as RentalType,
        hourlyRate,
        totalHours: durationHours,
        subtotal: Number(subtotal.toFixed(2)),
        monthlyDiscount: monthlyDiscount > 0 ? Number(monthlyDiscount.toFixed(2)) : undefined,
        total: Number(total.toFixed(2)),
    };
}

/**
 * Format price breakdown for display
 */
export function formatPricingBreakdown(pricing: PricingBreakdown): string {
    const lines = [
        `Rate: $${pricing.hourlyRate}/hr (${pricing.totalHours} hour${pricing.totalHours > 1 ? 's' : ''})`,
        `Subtotal: $${pricing.subtotal}`,
    ];

    if (pricing.monthlyDiscount) {
        lines.push(`Monthly Discount: -$${pricing.monthlyDiscount}`);
    }

    if (pricing.gearStorageFee) {
        lines.push(`Gear Storage: +$${pricing.gearStorageFee}`);
    }

    lines.push(`Total: $${pricing.total}`);

    return lines.join('\n');
}
