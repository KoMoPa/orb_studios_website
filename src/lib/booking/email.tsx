import { Resend } from 'resend';
import { BookingConfirmationEmail, MonthlyBookingConfirmationEmail, MonthlyRentalInvoiceEmail, CustomInvoiceEmail } from './email-templates';
import { generateIcalEventBuffer } from './ical';

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
    invoicePdfAttachment?: Buffer,
    eventTitle?: string,
    eventDescription?: string
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

    // Build attachments array
    const attachments: any[] = [];
    
    if (invoicePdfAttachment) {
        attachments.push({ filename: 'invoice.pdf', content: invoicePdfAttachment });
    }

    // Generate and add iCal attachment
    if (eventTitle && eventDescription) {
        try {
            const icalBuffer = generateIcalEventBuffer(
                eventTitle,
                startTime,
                endTime,
                eventDescription,
                clientEmail
            );
            attachments.push({ filename: 'booking.ics', content: icalBuffer });
        } catch (icalError) {
            console.error('Error generating iCal attachment:', icalError);
            // Continue without iCal attachment
        }
    }

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: clientEmail,
        subject: `Session Confirmed – Orb Studios`,
        react: emailComponent,
        attachments: attachments.length > 0 ? attachments : undefined,
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
    invoicePdfAttachment?: Buffer,
    eventTitle?: string,
    eventDescription?: string
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

    // Build attachments array
    const attachments: any[] = [];
    
    if (invoicePdfAttachment) {
        attachments.push({ filename: 'invoice.pdf', content: invoicePdfAttachment });
    }

    // Generate and add iCal attachment
    if (eventTitle && eventDescription) {
        try {
            const icalBuffer = generateIcalEventBuffer(
                eventTitle,
                startTime,
                endTime,
                eventDescription,
                ADMIN_EMAIL
            );
            attachments.push({ filename: 'booking.ics', content: icalBuffer });
        } catch (icalError) {
            console.error('Error generating iCal attachment:', icalError);
            // Continue without iCal attachment
        }
    }

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New Booking – ${clientName}`,
        react: emailComponent,
        attachments: attachments.length > 0 ? attachments : undefined,
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
    invoicePdfAttachment?: Buffer,
    eventTitle?: string,
    eventDescription?: string
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

        // Build attachments array
        const attachments: any[] = [];
        
        if (invoicePdfAttachment) {
            attachments.push({ filename: 'overage-invoice.pdf', content: invoicePdfAttachment });
        }

        // Generate and add iCal attachment
        if (eventTitle && eventDescription) {
            try {
                const icalBuffer = generateIcalEventBuffer(
                    eventTitle,
                    startTime,
                    endTime,
                    eventDescription,
                    clientEmail
                );
                attachments.push({ filename: 'booking.ics', content: icalBuffer });
            } catch (icalError) {
                console.error('Error generating iCal attachment:', icalError);
                // Continue without iCal attachment
            }
        }

        await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: clientEmail,
            subject: `Monthly Session Confirmed – Orb Studios`,
            react: emailComponent,
            attachments: attachments.length > 0 ? attachments : undefined,
        });

        await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `Monthly Booking – ${clientName}`,
            react: emailComponent,
            attachments: attachments.length > 0 ? attachments : undefined,
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

export async function sendCustomInvoiceEmail(
    clientEmail: string,
    clientName: string,
    description: string,
    invoiceDate: string,
    subtotal: number,
    hstAmount: number,
    totalPrice: number,
    invoicePdfAttachment?: Buffer
) {
    const emailComponent = CustomInvoiceEmail({
        clientName,
        description,
        invoiceDate,
        subtotal,
        hstAmount,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: clientEmail,
        subject: `Invoice – ${description} – Orb Studios`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending custom invoice email to client:', error);
        throw new Error(`Failed to send custom invoice: ${error.message}`);
    }

    return { success: true };
}

export async function notifyAdminCustomInvoice(
    clientEmail: string,
    clientName: string,
    description: string,
    invoiceDate: string,
    subtotal: number,
    hstAmount: number,
    totalPrice: number,
    invoicePdfAttachment?: Buffer
) {
    const emailComponent = CustomInvoiceEmail({
        clientName,
        description,
        invoiceDate,
        subtotal,
        hstAmount,
        totalPrice,
        hasInvoice: !!invoicePdfAttachment,
    });

    const { error } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `Custom Invoice – ${clientName} – ${description}`,
        react: emailComponent,
        attachments: invoicePdfAttachment
            ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
            : undefined,
    });

    if (error) {
        console.error('Error sending custom invoice notification to admin:', error);
        throw new Error(`Failed to send admin notification: ${error.message}`);
    }

    return { success: true };
}
