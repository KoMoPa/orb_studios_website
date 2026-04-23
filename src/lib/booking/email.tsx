import { Resend } from 'resend';
import { BookingConfirmationEmail, MonthlyBookingConfirmationEmail } from './email-templates';

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
    const sessionDate = fmtDate(startT    const sessionDate = fmtDate(startT    const sessionDate = fmtDate(startT    const sessionilC    const sessionDate = fmtDate(startT    const sessiame    const sessionDate = fmtDate(startT    const sessionDate = fmtDate(startT Pric    const sessionDate = fmtDate(startT    const sessionDate = fmtDate(star} =    const sessionDate = fmtDate(st      const sessionDate = fmtDate(start,
                                     ect:                  d – O                     re                  t,
                          cePdfAttachme                          cePd'invoi                          cePdfAttachme  
                                                             nsole.error('Error sending booking confirmation email to client:', error);
        throw new Error(`Failed to send        thron email: ${error.message}`);
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

export async function sendMonexport async function rmationEmail(
    clientEmail: string,
                      ,
                         endTime: Date,
    duratio    umber,
    monthlyIncluded: number,
    overageHours: number,
    overageCost:    overageCost:    overageCost:    overageCost:    overageCost:    ove    try {
        const sessionDate = fmtDate(startTime);
        const sessi        const sesse(startTime)} – ${fmtTime(endTime)}`;

        const emailComp        const emailComp        conEmail({
                                              e,
                                                                                                                             ,
                                   
                          = invoicePdfAttachment
            ? [{ filename: 'overage-invoice.pdf', content: invoicePdfAttachment }]
            : undefined;

        awa        awa        awa        awa        awa        awa        awa       ,
            to:             to:             ject:            to:             to:             ject:            ct:             to:             attachments,
                                              {
            from: `Orb            from: `Orb     ,
            to: ADMIN_EMAI            to: ADMIN_EMAI            to: ADMIN_EMAI            to: ADMIN_EMAI            to: A
                                               et                                               et                          end                                               et               n                                               error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
