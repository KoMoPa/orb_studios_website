import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'orbmusicstudios@gmail.com';

/**
 * React Email component for booking confirmation
 */
export function BookingConfirmationEmail({
    clientName,
    startTime,
    endTime,
    totalPrice,
    rentalType,
    bookingId,
}: {
    clientName: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    rentalType: string;
    bookingId?: string;
}) {
    const backgroundColor = '#ffffff';
    const accentColor = '#3b82f6'; // Blue
    const textDark = '#1f2937';
    const textGray = '#6b7280';
    const borderColor = '#e5e7eb';
    const bgLight = '#f9fafb';

    return (
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor, padding: '0', margin: '0' }}>
            {/* Header */}
            <div style={{ backgroundColor: accentColor, color: 'white', padding: '40px 20px', textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
                    ✓ Booking Confirmed
                </h1>
                <p style={{ margin: '0', fontSize: '16px', opacity: 0.95 }}>
                    Your session at Orb Studios is all set!
                </p>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Greeting */}
                <p style={{ fontSize: '16px', color: textDark, margin: '0 0 30px 0', lineHeight: '1.6' }}>
                    Hi <strong>{clientName}</strong>,
                </p>

                {/* Booking Details Card */}
                <div style={{
                    backgroundColor: bgLight,
                    border: `2px solid ${accentColor}`,
                    borderRadius: '12px',
                    padding: '30px',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ margin: '0 0 25px 0', fontSize: '18px', fontWeight: '600', color: textDark }}>
                        Booking Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: textGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Rental Type
                            </p>
                            <p style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: textDark }}>
                                {rentalType}
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: textGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Start Time
                            </p>
                            <p style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: textDark }}>
                                {startTime}
                            </p>
                        </div>

                        <div>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: textGray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                End Time
                            </p>
                            <p style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: textDark }}>
                                {endTime}
                            </p>
                        </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '20px', marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: textDark }}>Total Price:</span>
                            <span style={{ fontSize: '28px', fontWeight: '700', color: accentColor }}>
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Booking ID */}
                {bookingId && (
                    <div style={{ backgroundColor: bgLight, padding: '15px 20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray, textTransform: 'uppercase', fontWeight: '600' }}>
                            Booking Reference
                        </p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: accentColor, fontFamily: 'monospace' }}>
                            {bookingId}
                        </p>
                    </div>
                )}

                {/* Important Info */}
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: `4px solid ${accentColor}` }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: textDark }}>
                        📅 Next Steps
                    </h3>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: textDark, lineHeight: '1.8' }}>
                        <li><strong>Check your calendar</strong> - An event has been added to our studio calendar</li>
                        <li><strong>Arrive 10 minutes early</strong> - We're located at 124 Portland St, Etobicoke, ON M8Y 1B2</li>
                        <li><strong>Have questions?</strong> - Reply to this email or call us</li>
                    </ul>
                </div>

                {/* Call to Action */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <a href="mailto:orbmusicstudios@gmail.com" style={{
                        display: 'inline-block',
                        backgroundColor: accentColor,
                        color: 'white',
                        padding: '14px 40px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px'
                    }}>
                        Contact Us
                    </a>
                </div>

                {/* Studio Info */}
                <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: textDark }}>
                        Orb Studios
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: textGray, lineHeight: '1.6' }}>
                        124 Portland St<br />
                        Etobicoke, ON M8Y 1B2<br />
                        <a href="mailto:orbmusicstudios@gmail.com" style={{ color: accentColor, textDecoration: 'none', fontWeight: '500' }}>
                            orbmusicstudios@gmail.com
                        </a>
                    </p>
                </div>

                {/* Footer Note */}
                <p style={{ fontSize: '12px', color: textGray, margin: '0', textAlign: 'center', fontStyle: 'italic' }}>
                    Invoice PDF is attached to this email
                </p>
            </div>

            {/* Footer */}
            <div style={{ backgroundColor: bgLight, borderTop: `1px solid ${borderColor}`, padding: '20px', textAlign: 'center', fontSize: '12px', color: textGray }}>
                <p style={{ margin: '0' }}>
                    © 2026 Orb Studios. All rights reserved.
                </p>
            </div>
        </div>
    );
}

/**
 * React Email component for monthly client booking confirmation
 */
export function MonthlyClientBookingConfirmationEmail({
    clientName,
    startTime,
    endTime,
    duration,
    monthlyIncluded,
    overageHours,
    overageCost,
    bookingId,
}: {
    clientName: string;
    startTime: string;
    endTime: string;
    duration: number;
    monthlyIncluded: number;
    overageHours: number;
    overageCost: number;
    bookingId?: string;
}) {
    const backgroundColor = '#ffffff';
    const accentColor = '#3b82f6';
    const textDark = '#1f2937';
    const textGray = '#6b7280';
    const borderColor = '#e5e7eb';
    const bgLight = '#f9fafb';

    return (
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor, padding: '0', margin: '0' }}>
            {/* Header */}
            <div style={{ backgroundColor: accentColor, color: 'white', padding: '40px 20px', textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
                    ✓ Monthly Booking Confirmed
                </h1>
                <p style={{ margin: '0', fontSize: '16px', opacity: 0.95 }}>
                    Your studio session is reserved!
                </p>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Greeting */}
                <p style={{ fontSize: '16px', color: textDark, margin: '0 0 30px 0', lineHeight: '1.6' }}>
                    Hi {clientName},
                </p>

                {/* Session Details */}
                <div style={{ backgroundColor: bgLight, padding: '30px 20px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${borderColor}` }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: textDark }}>
                        Booking Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray, textTransform: 'uppercase', fontWeight: '600' }}>
                                Date
                            </p>
                            <p style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: textDark }}>
                                {startTime.split(' ').slice(0, 3).join(' ')}
                            </p>
                        </div>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray, textTransform: 'uppercase', fontWeight: '600' }}>
                                Duration
                            </p>
                            <p style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: textDark }}>
                                {duration} hour{duration !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: textGray, textTransform: 'uppercase', fontWeight: '600' }}>
                            Session Time
                        </p>
                        <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: textDark }}>
                            {startTime.split(' ').slice(3).join(' ')} – {endTime.split(' ').slice(3).join(' ')}
                        </p>
                    </div>
                </div>

                {/* Allocation Details */}
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '25px', borderRadius: '8px', marginBottom: '30px', borderLeft: `4px solid ${accentColor}`, border: `1px solid ${accentColor}20` }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '700', color: textDark, textTransform: 'uppercase' }}>
                        Monthly Allocation
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray }}>
                                Hours Included
                            </p>
                            <p style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: accentColor }}>
                                {monthlyIncluded}h
                            </p>
                        </div>
                        {overageHours > 0 && (
                            <div>
                                <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray }}>
                                    Overage Hours
                                </p>
                                <p style={{ margin: '0', fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                                    {overageHours}h
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing if overage */}
                {overageHours > 0 && (
                    <div style={{ backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #fcd34d' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '700', color: '#92400e' }}>
                            ⚠️ Overage Charges
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #fcd34d', marginBottom: '10px' }}>
                            <span style={{ color: '#92400e' }}>{overageHours} hour{overageHours !== 1 ? 's' : ''} @ 50% off rehearsal rate</span>
                            <strong style={{ color: '#92400e' }}>${overageCost.toFixed(2)}</strong>
                        </div>
                        <p style={{ margin: '0', fontSize: '12px', color: '#92400e' }}>
                            An invoice will be sent to you separately.
                        </p>
                    </div>
                )}

                {/* Booking ID */}
                {bookingId && (
                    <div style={{ backgroundColor: bgLight, padding: '15px 20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: textGray, textTransform: 'uppercase', fontWeight: '600' }}>
                            Booking Reference
                        </p>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: accentColor, fontFamily: 'monospace' }}>
                            {bookingId}
                        </p>
                    </div>
                )}

                {/* Important Info */}
                <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: `4px solid ${accentColor}` }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: textDark }}>
                        📅 Next Steps
                    </h3>
                    <ul style={{ margin: '0', paddingLeft: '20px', color: textDark, lineHeight: '1.8' }}>
                        <li><strong>Check your calendar</strong> - An event has been added to our studio calendar</li>
                        <li><strong>Arrive on time</strong> - Please be ready to start your session at the scheduled time</li>
                        <li><strong>Have questions?</strong> - Reply to this email or call us</li>
                    </ul>
                </div>

                {/* Call to Action */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <a href="mailto:orbmusicstudios@gmail.com" style={{
                        display: 'inline-block',
                        backgroundColor: accentColor,
                        color: 'white',
                        padding: '14px 40px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px'
                    }}>
                        Contact Us
                    </a>
                </div>

                {/* Studio Info */}
                <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: textDark }}>
                        Orb Studios
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: textGray, lineHeight: '1.6' }}>
                        124 Portland St<br />
                        Etobicoke, ON M8Y 1B2<br />
                        <a href="mailto:orbmusicstudios@gmail.com" style={{ color: accentColor, textDecoration: 'none', fontWeight: '500' }}>
                            orbmusicstudios@gmail.com
                        </a>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{ backgroundColor: bgLight, borderTop: `1px solid ${borderColor}`, padding: '20px', textAlign: 'center', fontSize: '12px', color: textGray }}>
                <p style={{ margin: '0' }}>
                    © 2026 Orb Studios. All rights reserved.
                </p>
            </div>
        </div>
    );
}

/**
 * Send monthly client booking confirmation email
 */
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
        const emailContent = MonthlyClientBookingConfirmationEmail({
            clientName,
            startTime: startTime.toLocaleString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Toronto',
            }),
            endTime: endTime.toLocaleString('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Toronto',
            }),
            duration,
            monthlyIncluded,
            overageHours,
            overageCost,
            bookingId,
        });

        // Send to client
        const clientEmailResult = await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: clientEmail,
            subject: `Monthly Booking Confirmation - Orb Studios`,
            react: emailContent,
            attachments: invoicePdfAttachment
                ? [
                    {
                        filename: 'overage-invoice.pdf',
                        content: invoicePdfAttachment,
                    },
                ]
                : undefined,
        });

        // Send copy to admin
        const adminEmailResult = await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `Monthly Booking - ${clientName}`,
            react: emailContent,
            attachments: invoicePdfAttachment
                ? [
                    {
                        filename: 'overage-invoice.pdf',
                        content: invoicePdfAttachment,
                    },
                ]
                : undefined,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending monthly booking confirmation email:', error);
        throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Send booking confirmation email to client and admin
 */
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
    const templateId = process.env.RESEND_BOOKING_TEMPLATE_ID;

    const formattedDate = startTime.toLocaleString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
    });

    const formattedEndDate = endTime.toLocaleString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
    });

    const attachments = invoicePdfAttachment
        ? [{ filename: 'invoice.pdf', content: invoicePdfAttachment }]
        : undefined;

    // Send to client using Resend template
    const { data: clientData, error: clientError } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: clientEmail,
        subject: `Booking Confirmation - Orb Studios`,
        ...(templateId
            ? {
                template: {
                    id: templateId,
                    variables: {
                        NAME: clientName,
                        TYPE: rentalType,
                        DATE: formattedDate,
                        PRICE: `$${totalPrice.toFixed(2)}`,
                    },
                },
            }
            : {
                react: BookingConfirmationEmail({
                    clientName,
                    startTime: formattedDate,
                    endTime: formattedEndDate,
                    totalPrice,
                    rentalType,
                    bookingId,
                }),
            }),
        attachments,
    });

    if (clientError) {
        console.error('Error sending client booking confirmation email:', clientError);
        throw new Error(`Failed to send client confirmation email: ${clientError.message}`);
    }

    // Send copy to admin (always uses React component)
    const { error: adminError } = await resend.emails.send({
        from: `Orb Studios <${SENDER_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New Booking - ${clientName}`,
        react: BookingConfirmationEmail({
            clientName,
            startTime: formattedDate,
            endTime: formattedEndDate,
            totalPrice,
            rentalType,
            bookingId,
        }),
        attachments,
    });

    if (adminError) {
        console.error('Error sending admin booking notification:', adminError);
    }

    return { success: true };
}

/**
 * Send admin notification for new booking (DEPRECATED - using sendBookingConfirmationEmail instead)
 * This function is kept for backward compatibility but sendBookingConfirmationEmail already sends admin notification
 */
export async function notifyAdminNewBooking(
    clientName: string,
    clientEmail: string,
    startTime: Date,
    rentalType: string
) {
    // This function is now redundant since sendBookingConfirmationEmail already sends admin notification
    return { success: true };
}
