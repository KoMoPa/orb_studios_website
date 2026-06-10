import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceDocument } from './invoice-document';
import { PricingBreakdown } from './types';

/**
 * Generate Invoice PDF as Buffer
 * Can be used for email attachments or direct downloads
 */
export async function generateInvoicePDF(params: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    bookingDate: Date;
    startTime?: Date;
    endTime?: Date;
    pricing: PricingBreakdown;
    rentalType: string;
    isMonthly?: boolean;
    invoiceType?: 'hourly' | 'monthly' | 'custom';
    customDescription?: string;
}): Promise<Buffer> {
    try {
        const pdfBuffer = await renderToBuffer(
            <InvoiceDocument
                invoiceNumber={params.invoiceNumber}
                clientName={params.clientName}
                clientEmail={params.clientEmail}
                bookingDate={params.bookingDate}
                startTime={params.startTime}
                endTime={params.endTime}
                pricing={params.pricing}
                rentalType={params.rentalType}
                isMonthly={params.isMonthly}
                invoiceType={params.invoiceType}
                customDescription={params.customDescription}
            />
        );
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating invoice PDF:', error);
        throw new Error(`Failed to generate invoice PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Format rental type for display
 */
export function formatRentalType(rentalType: string): string {
    const mapping: Record<string, string> = {
        'hourly-rehearsal': 'Hourly Rehearsal',
        'hourly-recording': 'Hourly Recording',
        'monthly': 'Monthly',
    };
    return mapping[rentalType] || rentalType;
}

/**
 * Generate invoice number based on date and booking ID
 */
export function generateInvoiceNumber(bookingId: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hash = bookingId.split('-').pop() || 'XXX';
    return `INV-${year}-${month}-${hash}`;
}
