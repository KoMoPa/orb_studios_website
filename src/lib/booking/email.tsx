import { Resend } from 'resend';
import { BookingConfirmationEmail, MonthlyBookingConfirmationEmail, MonthlyRentalInvoiceEmail } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'orbmusicstudios@gmail.com';

function fmtDate(d: Date): string {
    return d.toLocaleDateString('en-CA', {
        timeZone: 'America/Toronto',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function fmtTime(d: Date): string {
    return d.toLocaleTimeString('en-CA', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export async function sendBookingConfirmationEmail(
    clientEmail: string,
    clientName: string,
    startTime: Date,
    endTime: Date,
    totalPrice: number,
    rentalType: string,
    bookingId?: string,
    invoicePdfAttachment?: Buffer
) {
    const sessionDate = fmtDate(startTime);
    const sessionTime = `${fmtTime(startTime)} – ${fmtTime(endTime)}`;

    const emailComponent = BookingConfirmationEmail({
        clientName,
        rentalType,
        sessionDate,
        sessionTime,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: clientEmail,
        subject: `Session Confirmed – Orb Studios`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending booking confirmation email to client:', error);
        throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    return { success: true };
}

export async function notifyAdminNewBooking(
    clientEmail: string,
    clientName: string,
    startTime: Date,
    endTime: Date,
    totalPrice: number,
    rentalType: string,
    bookingId?: string,
    invoicePdfAttachment?: Buffer
) {
    const sessionDate = fmtDate(startTime);
    const sessionTime = `${fmtTime(startTime)} – ${fmtTime(endTime)}`;

    const emailComponent = BookingConfirmationEmail({
        clientName,
        rentalType,
        sessionDate,
        sessionTime,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New Booking – ${clientName}`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending booking notification email to admin:', error);
    }

    return { success: true };
}

export async function sendMonthlyClientBookingConfirmationEmail(
    clientEmail: string,
    clientName: string,
    startTime: Date,
    endTime: Date,
    duration: number,
    monthlyIncluded: number,
    overageHours: number,
    overageCost: number,
    bookingId?: string,
    invoicePdfAttachment?: Buffer
) {
    try {
        const sessionDate = fmtDate(startTime);
        const sessionTime = `${fmtTime(startTime)} – ${fmtTime(endTime)}`;

        const emailComponent = MonthlyBookingConfirmationEmail({
            clientName,
            sessionDate,
            sessionTime,
            duration,
            monthlyIncluded,
            overageHours,
            overageCost,
            bookingId,
        });

        const attachments = invoicePdfAttachment
            ? [{ filename: 'overage-invoice.pdf', content: invoicePdfAttachment }]
            : undefined;

        await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: clientEmail,
            subject: `Monthly Session Confirmed – Orb Studios`,
            react: emailComponent,
            attachments,
        });

        await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `Monthly Booking – ${clientName}`,
            react: emailComponent,
            attachments,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending monthly booking confirmation email:', error);
        throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function sendMonthlyRentalInvoiceEmail(
    clientEmail: string,
    clientName: string,
    monthYear: string,
    totalPrice: number,
    invoicePdfAttachment?: Buffer
) {
    const emailComponent = MonthlyRentalInvoiceEmail({
        clientName,
        monthYear,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: clientEmail,
        subject: `Monthly Rental Invoice – Orb Studios`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending monthly rental invoice email to client:', error);
        throw new Error(`Failed to send monthly rental invoice: ${error.message}`);
    }

    return { success: true };
}

export async function notifyAdminMonthlyRentalInvoice(
    clientEmail: string,
    clientName: string,
    monthYear: string,
    totalPrice: number,
    invoicePdfAttachment?: Buffer
) {
    const emailComponent = MonthlyRentalInvoiceEmail({
        clientName,
        monthYear,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `Monthly Rental Invoice – ${clientName}`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending monthly rental invoice notification to admin:', error);
        throw new Error(`Failed to send admin notification: ${error.message}`);
    }

    return { success: true };
}
