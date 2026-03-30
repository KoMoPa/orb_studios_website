// Types for the booking system
export type RentalType = 'monthly' | 'hourly-recording' | 'hourly-rehearsal';

export interface BookingRequest {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    bandName?: string;
    preferredDate: string; // YYYY-MM-DD
    preferredTime: string; // HH:mm
    duration: number; // minutes
    rentalType: RentalType;
    additionalInfo?: string;
}

export interface AvailabilitySlot {
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    available: boolean;
}

export interface BookingConfirmation {
    bookingId: string;
    clientEmail: string;
    eventTitle: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    invoicePdfUrl?: string;
}

export interface PricingBreakdown {
    rentalType: RentalType;
    hourlyRate: number;
    totalMinutes: number;
    subtotal: number;
    monthlyDiscount?: number;
    total: number;
}

export interface ClientRecord {
    id: string;
    email: string;
    name: string;
    isMonthly: boolean;
    monthlyExpiresAt?: Date;
    createdAt: Date;
}

export interface BookingRecord {
    id: string;
    clientId?: string;
    clientEmail: string;
    clientName: string;
    startTime: Date;
    endTime: Date;
    rentalType: RentalType;
    sessionType: SessionType;
    totalPrice: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    googleCalendarEventId?: string;
    invoiceUrl?: string;
    createdAt: Date;
}
