import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PricingBreakdown } from './types';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        paddingTop: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 15,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#8b3a3a',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    address: {
        fontSize: 10,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 10,
        color: '#333',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        width: '40%',
        fontSize: 10,
        color: '#666',
    },
    value: {
        width: '60%',
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceTable: {
        width: '100%',
        marginTop: 12,
        border: '1px solid #ddd',
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    tableLabel: {
        width: '70%',
        fontSize: 10,
    },
    tableValue: {
        width: '30%',
        fontSize: 10,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    totalRow: {
        backgroundColor: '#8b3a3a',
        paddingVertical: 8,
    },
    totalLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#fff',
        fontWeight: 'bold',
    },
    paymentNote: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#fef2f2',
        borderWidth: 2,
        borderColor: '#8b3a3a',
        borderRadius: 4,
    },
    paymentNoteTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#8b3a3a',
        marginBottom: 5,
    },
    paymentNoteText: {
        fontSize: 10,
        color: '#7f1d1d',
        lineHeight: 1.3,
    },
    footer: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        textAlign: 'center',
        fontSize: 9,
        color: '#999',
    },
});

export function InvoiceDocument({
    invoiceNumber,
    clientName,
    clientEmail,
    bookingDate,
    startTime,
    endTime,
    pricing,
    rentalType,
    isMonthly = false,
}: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    bookingDate: Date;
    startTime?: Date;
    endTime?: Date;
    pricing: PricingBreakdown;
    rentalType: string;
    isMonthly?: boolean;
}) {
    const durationHours = startTime && endTime ? (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) : 0;
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Toronto',
    });
    const dateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
    });

    // Calculate HST (13%)
    const subtotalBeforeHST = pricing.subtotal || (pricing.total / 1.13);
    const hstAmount = pricing.total - subtotalBeforeHST;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>INVOICE</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>Invoice #{invoiceNumber}</Text>
                    <Text style={{ ...styles.address, fontSize: 9, marginTop: 3 }}>Orb Studios</Text>
                    <Text style={{ ...styles.address, fontSize: 9 }}>124 Portland St, Etobicoke, ON M8Y 1B2</Text>
                    <Text style={{ ...styles.address, fontSize: 9 }}>orbmusicstudios@gmail.com</Text>
                </View>

                {/* Invoice Details */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Invoice Date:</Text>
                        <Text style={styles.value}>{dateFormatter.format(bookingDate)}</Text>
                    </View>
                </View>

                {/* Bill To */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill To:</Text>
                    <Text style={{ fontSize: 10, marginBottom: 3 }}>{clientName}</Text>
                    <Text style={{ fontSize: 10, color: '#666' }}>{clientEmail}</Text>
                </View>

                {/* Booking Details */}
                {!isMonthly && startTime && endTime ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Booking Details</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Rental Type:</Text>
                            <Text style={styles.value}>{rentalType}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Date & Time:</Text>
                            <Text style={styles.value}>{dateTimeFormatter.format(startTime)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>End Time:</Text>
                            <Text style={styles.value}>{dateTimeFormatter.format(endTime)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Duration:</Text>
                            <Text style={styles.value}>{durationHours.toFixed(1)} hours</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Booking Details</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Rental Type:</Text>
                            <Text style={styles.value}>Monthly Rental</Text>
                        </View>
                    </View>
                )}

                {/* Pricing Breakdown */}
                <View style={styles.priceTable}>
                    {isMonthly ? (
                        <>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>Monthly Rental Rate</Text>
                                <Text style={styles.tableValue}>${pricing.subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>HST (13%)</Text>
                                <Text style={styles.tableValue}>${hstAmount.toFixed(2)}</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>Rate</Text>
                                <Text style={styles.tableValue}>${pricing.hourlyRate.toFixed(2)}/hr</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>Duration</Text>
                                <Text style={styles.tableValue}>{durationHours.toFixed(1)} hrs</Text>
                            </View>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>Subtotal</Text>
                                <Text style={styles.tableValue}>${pricing.subtotal.toFixed(2)}</Text>
                            </View>

                            {pricing.monthlyDiscount && (
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Monthly Discount</Text>
                                    <Text style={styles.tableValue}>-${pricing.monthlyDiscount.toFixed(2)}</Text>
                                </View>
                            )}

                            {pricing.gearStorageFee && (
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableLabel}>Gear Storage</Text>
                                    <Text style={styles.tableValue}>+${pricing.gearStorageFee.toFixed(2)}</Text>
                                </View>
                            )}

                            <View style={styles.tableRow}>
                                <Text style={styles.tableLabel}>HST (13%)</Text>
                                <Text style={styles.tableValue}>${hstAmount.toFixed(2)}</Text>
                            </View>
                        </>
                    )}

                    <View style={{ ...styles.tableRow, ...styles.totalRow }}>
                        <Text style={{ ...styles.tableLabel, ...styles.totalLabel }}>Total Due</Text>
                        <Text style={{ ...styles.tableValue, ...styles.totalValue }}>${pricing.total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Payment Instructions */}
                <View style={styles.paymentNote}>
                    <Text style={styles.paymentNoteTitle}>PAYMENT INSTRUCTIONS</Text>
                    <Text style={styles.paymentNoteText}>Please send payment via e-Transfer to:</Text>
                    <Text style={{ ...styles.paymentNoteText, fontWeight: 'bold', marginTop: 2 }}>
                        orbmusicstudios@gmail.com
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for booking with Orb Studios!</Text>
                    <Text>Questions? Email: orbmusicstudios@gmail.com</Text>
                </View>
            </Page>
        </Document>
    );
}
