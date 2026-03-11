import { Resend } from 'resend';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * React Email component for booking confirmation
 */
export function BookingConfirmationEmail({
    clientName,
    startTime,
    endTime,
    totalPrice,
    sessionType,
    rentalType,
}: {
    clientName: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    sessionType: string;
    rentalType: string;
}) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <h1>Booking Confirmed! 🎵</h1>
            <p>Hi {clientName},</p>
            <p>Your booking at Orb Studios has been confirmed.</p>

            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
                <h2>Booking Details</h2>
                <p><strong>Session Type:</strong> {sessionType}</p>
                <p><strong>Rental Type:</strong> {rentalType}</p>
                <p><strong>Start Time:</strong> {startTime}</p>
                <p><strong>End Time:</strong> {endTime}</p>
                <p><strong>Total Price:</strong> <strong>${totalPrice.toFixed(2)}</strong></p>
            </div>

            <p>
                You'll receive an iCalendar invite shortly. Please check your calendar and let us know if you have any questions.
            </p>

            <p>
                <strong>Orb Studios</strong><br />
                124 Portland St, Etobicoke, ON M8Y 1B2<br />
                <a href="mailto:orbmusicstudios@gmail.com">orbmusicstudios@gmail.com</a>
            </p>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '30px' }}>
                Invoice PDF is attached to this email.
            </p>
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
    sessionType: string,
    rentalType: string,
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
            sessionType,
            rentalType,
        });

        // Send to client
        await resend.emails.send({
            from: 'Orb Studios <onboarding@resend.dev>',
            to: clientEmail,
            subject: `Booking Confirmation - Orb Studios`,
            react: emailContent as any,
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
        await resend.emails.send({
            from: 'Orb Studios <onboarding@resend.dev>',
            to: 'orbmusicstudios@gmail.com',
            subject: `New Booking - ${clientName}`,
            react: emailContent as any,
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
        throw new Error('Failed to send confirmation email');
    }
}

/**
 * Send admin notification for new booking
 */
export async function notifyAdminNewBooking(
    clientName: string,
    clientEmail: string,
    startTime: Date,
    sessionType: string,
    rentalType: string
) {
    try {
        await resend.emails.send({
            from: 'Orb Studios <onboarding@resend.dev>',
            to: 'orbmusicstudios@gmail.com',
            subject: `New Booking Request - ${clientName}`,
            html: `
        <p>New booking received!</p>
        <ul>
          <li>Client: ${clientName}</li>
          <li>Email: ${clientEmail}</li>
          <li>Date/Time: ${startTime.toLocaleString()}</li>
          <li>Session Type: ${sessionType}</li>
          <li>Rental Type: ${rentalType}</li>
        </ul>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error('Error notifying admin:', error);
        throw new Error('Failed to notify admin');
    }
}
