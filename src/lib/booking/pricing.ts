import { PricingBreakdown, RentalType } from './types';

const HOURLY_RATES = {
    'hourly-rehearsal': 30,
    'hourly-recording': 50,
    'monthly': 400,
};

const GEAR_STORAGE_FEE = 0; // Included in monthly plan

/**
 * Calculate booking price based on rental type, duration, and client status
 */
export function calculatePrice(
    rentalType: RentalType,
    durationMinutes: number,
    isMonthlyClient: boolean = false,
    includeGearStorage: boolean = false
): PricingBreakdown {
    const hourlyRate = HOURLY_RATES[rentalType];
    const durationHours = durationMinutes / 60;

    let subtotal = hourlyRate * durationHours;
    let monthlyDiscount = 0;
    let gearStorageFee = 0;

    // Apply monthly discount if applicable
    if (isMonthlyClient && rentalType !== 'monthly') {
        // Monthly clients get 20% discount on hourly bookings
        monthlyDiscount = subtotal * 0.2;
        subtotal -= monthlyDiscount;
    }

    // Add gear storage fee for non-monthly clients
    if (includeGearStorage && rentalType !== 'monthly') {
        gearStorageFee = 50; // $50/month storage
    }

    const total = subtotal + gearStorageFee;

    return {
        rentalType,
        hourlyRate,
        totalMinutes: durationMinutes,
        subtotal: Number(subtotal.toFixed(2)),
        monthlyDiscount: monthlyDiscount > 0 ? Number(monthlyDiscount.toFixed(2)) : undefined,
        gearStorageFee: gearStorageFee > 0 ? gearStorageFee : undefined,
        total: Number(total.toFixed(2)),
    };
}

/**
 * Format price breakdown for display
 */
export function formatPricingBreakdown(pricing: PricingBreakdown): string {
    const lines = [
        `Rate: $${pricing.hourlyRate}/hr (${pricing.totalMinutes} minutes)`,
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
