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
                                {rentalType === 'hourly-rehearsal' ? 'Hourly Rehearsal' : rentalType === 'hourly-recording' ? 'Hourly Recording' : 'Monthly'}
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
    try {
        const emailContent = BookingConfirmationEmail({
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
            totalPrice,
            rentalType,
            bookingId,
        });

        // Send to client
        const clientEmailResult = await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: clientEmail,
            subject: `Booking Confirmation - Orb Studios`,
            react: emailContent,
            attachments: invoicePdfAttachment
                ? [
                    {
                        filename: 'invoice.pdf',
                        content: invoicePdfAttachment,
                    },
                ]
                : undefined,
        });

        // Send copy to admin
        const adminEmailResult = await resend.emails.send({
            from: `Orb Studios <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `New Booking - ${clientName}`,
            react: emailContent,
            attachments: invoicePdfAttachment
                ? [
                    {
                        filename: 'invoice.pdf',
                        content: invoicePdfAttachment,
                    },
                ]
                : undefined,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw new Error(`Failed to send confirmation email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
