import { Html, Head, Body, Preview } from '@react-email/components';
import React from 'react';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const c = {
    bgDark: '#1c1917',
    bgCard: '#292524',
    bgFooter: '#0c0a09',
    border: '#44403c',
    accent: '#832f2b',
    amber: '#f59e0b',
    white: '#ffffff',
    offWhite: '#fafaf9',
    gray: '#a8a29e',
    muted: '#78716c',
    green: '#4ade80',
    red: '#f87171',
    fontDisplay: "'Rubik Vinyl', Georgia, serif",
    fontGlitch: "'Rubik Glitch', Georgia, serif",
    fontBody: "Georgia, 'Times New Roman', serif",
} as const;

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Rubik+Vinyl&family=Rubik+Glitch&display=swap');body,html{margin:0;padding:0;width:100%!important;min-width:100%}table{border-collapse:collapse;width:100%}`;

// ─── Shared sub-components ─────────────────────────────────────────────────────
function OrbHeader({ title }: { title: string }) {
    return (
        <div style={{
            padding: '40px 20px',
            background: `linear-gradient(135deg, ${c.bgCard} 0%, ${c.bgDark} 100%)`,
            borderBottom: `3px solid ${c.accent}`,
            textAlign: 'center',
        }}>
            <div style={{
                display: 'inline-block',
                border: `2px solid ${c.accent}`,
                borderRadius: '50%',
                padding: '15px 20px',
                marginBottom: 20,
            }}>
                <span style={{ color: c.accent, fontSize: 28, fontWeight: 'bold', letterSpacing: 2, fontFamily: c.fontGlitch }}>
                    ORB STUDIOS
                </span>
            </div>
            <h1 style={{
                margin: '0 0 8px 0', padding: 0,
                fontSize: 28, fontWeight: 'normal',
                color: c.offWhite, letterSpacing: 3,
                textTransform: 'uppercase',
                fontFamily: c.fontDisplay,
            }}>
                {title}
            </h1>
        </div>
    );
}

function RulesCard() {
    return (
        <div style={{ padding: 25, marginBottom: 30, backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <h3 style={{
                margin: '0 0 20px 0', padding: 0,
                fontSize: 14, fontWeight: 'bold',
                color: c.offWhite, textTransform: 'uppercase', letterSpacing: 1,
            }}>
                🎸 some simple rules:
            </h3>
            <ul style={{ margin: 0, padding: '0 0 0 20px', color: c.gray, lineHeight: 2 }}>
                <li>
                    <p style={{ margin: 0 }}>
                        <strong>Load-in zone</strong> — Pull up to unload your gear right out front. We are guaranteed
                        one free parking spot, but there are usually a few open in front. If full, you can also park
                        on the curb right across the street, and after business hours at the scooter shop across the street.
                    </p>
                </li>
                <li>
                    <p style={{ margin: 0 }}>
                        <strong>Gear included</strong> — Amps, drums, PA system ready to go. For any help setting
                        things up check out the{' '}
                        <a href="https://orbstudios.ca/posts" style={{ color: '#067df7', textDecoration: 'none' }}>
                            Guides
                        </a>{' '}
                        on our website.
                    </p>
                </li>
                <li>
                    <p style={{ margin: 0 }}>
                        <strong>Back to Zero</strong> — Try to put everything back exactly where you grabbed it from;
                        wrap your cables wide not tight; turn off PA, heaters, and anything in the Mix room before you leave.
                    </p>
                </li>
                <li>
                    <p style={{ margin: 0 }}>
                        <strong>LOCK UP!</strong> — Make sure to lock both front doors when you leave.
                    </p>
                </li>
            </ul>
        </div>
    );
}

function EmailFooterInfo() {
    return (
        <>
            <div style={{ margin: '30px 0', borderTop: `1px solid ${c.border}` }} />
            <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: 16, fontWeight: 'bold', color: c.offWhite, fontFamily: c.fontGlitch }}>
                    Orb Studios
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: 14, color: c.muted }}>124 Portland St</p>
                <p style={{ margin: '0 0 15px 0', fontSize: 14, color: c.muted }}>Etobicoke, ON M8Y 1B2</p>
                <a href="mailto:orbmusicstudios@gmail.com" style={{ color: c.white, textDecoration: 'none', fontSize: 14 }}>
                    orbmusicstudios@gmail.com
                </a>
            </div>
        </>
    );
}

function EmailShell({ preview, children }: { preview: string; children: React.ReactNode }) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <meta name="viewport" content="width=device-width" />
                <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="x-apple-disable-message-reformatting" />
                <style>{fontImport}</style>
            </Head>
            <Preview>{preview}</Preview>
            <Body style={{ backgroundColor: c.bgDark, margin: 0, padding: 0 }}>
                <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: c.bgDark }}>
                                <table
                                    align="center"
                                    width="100%"
                                    border={0}
                                    cellPadding={0}
                                    cellSpacing={0}
                                    role="presentation"
                                    style={{ maxWidth: 600, margin: '0 auto' }}
                                >
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div style={{ fontFamily: c.fontBody, backgroundColor: c.bgDark }}>
                                                    {children}
                                                    <div style={{
                                                        padding: 20,
                                                        backgroundColor: c.bgFooter,
                                                        borderTop: `1px solid ${c.bgCard}`,
                                                        textAlign: 'center',
                                                    }}>
                                                        <p style={{ margin: 0, fontSize: 12, color: c.white }}>
                                                            © 2026 Orb Studios. Made with 🎵 in Mimico.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Body>
        </Html>
    );
}

// ─── One-time booking confirmation ─────────────────────────────────────────────
export function BookingConfirmationEmail({
    clientName,
    rentalType,
    sessionDate,
    sessionTime,
    totalPrice,
    hasInvoice = false,
}: {
    clientName: string;
    rentalType: string;
    sessionDate: string;
    sessionTime: string;
    totalPrice: number;
    hasInvoice?: boolean;
}) {
    return (
        <EmailShell preview="Your Orb session is confirmed!">
            <OrbHeader title="Session Booked" />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', backgroundColor: c.bgDark }}>
                <p style={{ margin: '0 0 30px 0', fontSize: 18, color: c.offWhite, lineHeight: 1.6 }}>
                    Hey {clientName},
                </p>
                <p style={{ margin: '0 0 30px 0', fontSize: 16, color: c.white, lineHeight: 1.7 }}>
                    We&apos;re stoked to have you coming in! Here are the details for your upcoming session:
                </p>

                {/* Session details card */}
                <div style={{
                    padding: 30, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `1px solid ${c.border}`,
                    borderLeft: `4px solid ${c.amber}`,
                }}>
                    <h2 style={{
                        margin: '0 0 25px 0', padding: 0,
                        fontSize: 20, fontWeight: 'bold',
                        color: c.white, textTransform: 'uppercase',
                        letterSpacing: 2, fontFamily: c.fontDisplay,
                    }}>
                        ✦ Session Details
                    </h2>
                    <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
                        <tbody>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>What</span>
                                        {rentalType}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>When</span>
                                        {sessionDate}<br />{sessionTime}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0' }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>Total</span>
                                        <span style={{ color: c.accent, fontSize: 28, fontWeight: 'bold' }}>$</span>
                                        {totalPrice.toFixed(2)}
                                        <span style={{ fontSize: 12, marginLeft: 8 }}>(HST included)</span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <RulesCard />

                {/* CTA */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <a
                        href="mailto:orbmusicstudios@gmail.com"
                        style={{
                            color: c.white, textDecoration: 'none',
                            display: 'inline-block',
                            padding: '14px 32px',
                            fontSize: 14, fontWeight: 'bold',
                            border: `2px solid ${c.accent}`,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}
                    >
                        Questions? Get in Touch!
                    </a>
                </div>

                <EmailFooterInfo />

                {hasInvoice && (
                    <p style={{ margin: '30px 0 0 0', textAlign: 'center', fontSize: 12, color: c.white, fontStyle: 'italic' }}>
                        Invoice PDF is attached to this email.<br />
                        Prompt Payment is Appreciated!<br />
                        E-transfer to our email above.
                    </p>
                )}
            </div>
        </EmailShell>
    );
}

// ─── Monthly booking confirmation ──────────────────────────────────────────────
export function MonthlyBookingConfirmationEmail({
    clientName,
    sessionDate,
    sessionTime,
    duration,
    monthlyIncluded,
    overageHours,
    overageCost,
    bookingId,
}: {
    clientName: string;
    sessionDate: string;
    sessionTime: string;
    duration: number;
    monthlyIncluded: number;
    overageHours: number;
    overageCost: number;
    bookingId?: string;
}) {
    const hasOverage = overageHours > 0;

    return (
        <EmailShell preview="Your Orb monthly session is confirmed!">
            <OrbHeader title="Monthly Session Booked" />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', backgroundColor: c.bgDark }}>
                <p style={{ margin: '0 0 30px 0', fontSize: 18, color: c.offWhite, lineHeight: 1.6 }}>
                    Hey {clientName},
                </p>
                <p style={{ margin: '0 0 30px 0', fontSize: 16, color: c.white, lineHeight: 1.7 }}>
                    We&apos;re stoked to have you coming in! Here are the details for your upcoming session:
                </p>

                {/* Session details card */}
                <div style={{
                    padding: 30, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `1px solid ${c.border}`,
                    borderLeft: `4px solid ${c.amber}`,
                }}>
                    <h2 style={{
                        margin: '0 0 25px 0', padding: 0,
                        fontSize: 20, fontWeight: 'bold',
                        color: c.white, textTransform: 'uppercase',
                        letterSpacing: 2, fontFamily: c.fontDisplay,
                    }}>
                        ✦ Session Details
                    </h2>
                    <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
                        <tbody>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>What</span>
                                        Monthly Rehearsal
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>When</span>
                                        {sessionDate}<br />{sessionTime}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0' }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4 }}>
                                            {hasOverage ? 'Overage' : 'Plan'}
                                        </span>
                                        {hasOverage ? (
                                            <>
                                                <span style={{ color: c.accent, fontSize: 28, fontWeight: 'bold' }}>$</span>
                                                {overageCost.toFixed(2)}
                                                <span style={{ fontSize: 12, marginLeft: 8 }}>overage charge</span>
                                            </>
                                        ) : (
                                            <span style={{ color: c.green, fontWeight: 'bold' }}>Included ✓</span>
                                        )}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Monthly allocation breakdown */}
                <div style={{
                    padding: 25, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `1px solid ${c.border}`,
                    borderLeft: `4px solid ${hasOverage ? c.accent : c.green}`,
                }}>
                    <h3 style={{
                        margin: '0 0 15px 0', padding: 0,
                        fontSize: 14, fontWeight: 'bold',
                        color: c.offWhite, textTransform: 'uppercase', letterSpacing: 1,
                    }}>
                        📋 Monthly Allocation
                    </h3>
                    <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px 0', color: c.gray, fontSize: 14 }}>Session duration</td>
                                <td style={{ padding: '8px 0', color: c.white, fontSize: 14, textAlign: 'right', fontWeight: 'bold' }}>
                                    {duration} hr{duration !== 1 ? 's' : ''}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0', color: c.gray, fontSize: 14 }}>Hours from monthly plan</td>
                                <td style={{ padding: '8px 0', color: c.green, fontSize: 14, textAlign: 'right', fontWeight: 'bold' }}>
                                    {monthlyIncluded} hr{monthlyIncluded !== 1 ? 's' : ''} included
                                </td>
                            </tr>
                            {hasOverage && (
                                <tr>
                                    <td style={{ padding: '12px 0 8px 0', color: c.gray, fontSize: 14, borderTop: `1px solid ${c.border}` }}>
                                        Overage ({overageHours} hr{overageHours !== 1 ? 's' : ''} @ 50% rate)
                                    </td>
                                    <td style={{ padding: '12px 0 8px 0', color: c.red, fontSize: 14, textAlign: 'right', fontWeight: 'bold', borderTop: `1px solid ${c.border}` }}>
                                        ${overageCost.toFixed(2)}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Booking reference */}
                {bookingId && (
                    <div style={{
                        padding: '15px 20px', marginBottom: 30,
                        backgroundColor: c.bgCard,
                        border: `1px solid ${c.border}`,
                        textAlign: 'center',
                    }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: 12, color: c.gray, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Booking Reference
                        </p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 'bold', color: c.amber, fontFamily: 'monospace' }}>
                            {bookingId}
                        </p>
                    </div>
                )}

                <RulesCard />

                {/* CTA */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <a
                        href="mailto:orbmusicstudios@gmail.com"
                        style={{
                            color: c.white, textDecoration: 'none',
                            display: 'inline-block',
                            padding: '14px 32px',
                            fontSize: 14, fontWeight: 'bold',
                            border: `2px solid ${c.accent}`,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}
                    >
                        Questions? Get in Touch!
                    </a>
                </div>

                <EmailFooterInfo />

                {hasOverage && (
                    <p style={{ margin: '30px 0 0 0', textAlign: 'center', fontSize: 12, color: c.white, fontStyle: 'italic' }}>
                        Overage invoice PDF is attached to this email.<br />
                        Prompt Payment is Appreciated!<br />
                        E-transfer to our email above.
                    </p>
                )}
            </div>
        </EmailShell>
    );
}

// ─── Monthly rental invoice (for manual invoicing) ────────────────────────────────
export function MonthlyRentalInvoiceEmail({
    clientName,
    monthYear,
    totalPrice,
    hasInvoice = false,
}: {
    clientName: string;
    monthYear: string;
    totalPrice: number;
    hasInvoice?: boolean;
}) {
    return (
        <EmailShell preview="Your Orb Studios monthly rental invoice">
            <OrbHeader title="Monthly Rental Invoice" />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px', backgroundColor: c.bgDark }}>
                <p style={{ margin: '0 0 30px 0', fontSize: 18, color: c.offWhite, lineHeight: 1.6 }}>
                    Hey {clientName},
                </p>
                <p style={{ margin: '0 0 30px 0', fontSize: 16, color: c.white, lineHeight: 1.7 }}>
                    Here's your invoice for your monthly studio rental with Orb Studios.
                </p>

                {/* Rental details card */}
                <div style={{
                    padding: 30, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `1px solid ${c.border}`,
                    borderLeft: `4px solid ${c.accent}`,
                }}>
                    <h2 style={{
                        margin: '0 0 25px 0', padding: 0,
                        fontSize: 20, fontWeight: 'bold',
                        color: c.white, textTransform: 'uppercase',
                        letterSpacing: 2, fontFamily: c.fontDisplay,
                    }}>
                        ✦ Rental Details
                    </h2>
                    <table width="100%" border={0} cellPadding={0} cellSpacing={0} role="presentation">
                        <tbody>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4, color: c.gray }}>Type</span>
                                        Monthly Rental
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0', borderBottom: `1px dashed ${c.border}` }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4, color: c.gray }}>Period</span>
                                        {monthYear}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '12px 0' }}>
                                    <p style={{ margin: 0, fontSize: 21, color: c.white }}>
                                        <span style={{ textTransform: 'uppercase', fontSize: 13, display: 'block', marginBottom: 4, color: c.gray }}>Total Due</span>
                                        <span style={{ color: c.accent, fontSize: 28, fontWeight: 'bold' }}>$</span>
                                        {totalPrice.toFixed(2)}
                                        <span style={{ fontSize: 12, marginLeft: 8, color: c.gray }}>(HST included)</span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* What's included */}
                <div style={{
                    padding: 25, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `1px solid ${c.border}`,
                    borderLeft: `4px solid ${c.green}`,
                }}>
                    <h3 style={{
                        margin: '0 0 15px 0', padding: 0,
                        fontSize: 14, fontWeight: 'bold',
                        color: c.offWhite, textTransform: 'uppercase', letterSpacing: 1,
                    }}>
                        ✓ What's Included
                    </h3>
                    <ul style={{ margin: 0, padding: '0 0 0 20px', color: c.gray, lineHeight: 1.8, fontSize: 14 }}>
                        <li style={{ marginBottom: 8 }}>Unlimited access to studio space</li>
                        <li style={{ marginBottom: 8 }}>Amps, drums, and PA system</li>
                        <li style={{ marginBottom: 8 }}>Parking and load-in zone</li>
                        <li>Access to setup guides on our website</li>
                    </ul>
                </div>

                <RulesCard />

                {/* Payment info */}
                <div style={{
                    padding: 25, marginBottom: 30,
                    backgroundColor: c.bgCard,
                    border: `2px solid ${c.accent}`,
                    textAlign: 'center',
                }}>
                    <h3 style={{
                        margin: '0 0 12px 0', padding: 0,
                        fontSize: 14, fontWeight: 'bold',
                        color: c.amber, textTransform: 'uppercase', letterSpacing: 1,
                    }}>
                        💸 Payment Instructions
                    </h3>
                    <p style={{ margin: 0, fontSize: 14, color: c.white, lineHeight: 1.6 }}>
                        Please send an e-transfer to:
                        <br />
                        <span style={{ fontWeight: 'bold', fontSize: 16 }}>orbmusicstudios@gmail.com</span>
                    </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <a
                        href="mailto:orbmusicstudios@gmail.com"
                        style={{
                            color: c.white, textDecoration: 'none',
                            display: 'inline-block',
                            padding: '14px 32px',
                            fontSize: 14, fontWeight: 'bold',
                            border: `2px solid ${c.accent}`,
                            textTransform: 'uppercase',
                            letterSpacing: 2,
                        }}
                    >
                        Questions? Get in Touch!
                    </a>
                </div>

                <EmailFooterInfo />

                {hasInvoice && (
                    <p style={{ margin: '30px 0 0 0', textAlign: 'center', fontSize: 12, color: c.white, fontStyle: 'italic' }}>
                        Invoice PDF is attached to this email.<br />
                        Prompt Payment is Appreciated!
                    </p>
                )}
            </div>
        </EmailShell>
    );
}
