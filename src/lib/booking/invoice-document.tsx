import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PricingBreakdown } from './types';

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 30,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B35',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    address: {
        fontSize: 10,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
        color: '#333',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: '40%',
        fontSize: 11,
        color: '#666',
    },
    value: {
        width: '60%',
        fontSize: 11,
        fontWeight: 'bold',
    },
    priceTable: {
        width: '100%',
        marginTop: 20,
        border: '1px solid #ddd',
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableLabel: {
        width: '70%',
        fontSize: 11,
    },
    tableValue: {
        width: '30%',
        fontSize: 11,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    totalRow: {
        backgroundColor: '#FF6B35',
        paddingVertical: 12,
    },
    totalLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    totalValue: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 40,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        textAlign: 'center',
        fontSize: 10,
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
    sessionType,
    rentalType,
}: {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    bookingDate: Date;
    startTime: Date;
    endTime: Date;
    pricing: PricingBreakdown;
    sessionType: string;
    rentalType: string;
}) {
    const durationHours = pricing.totalMinutes / 60;
    const dateFormatter = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>INVOICE</Text>
                    <Text style={{ fontSize: 11, color: '#666' }}>Invoice #{invoiceNumber}</Text>
                    <Text style={styles.address}>Orb Studios</Text>
                    <Text style={styles.address}>124 Portland St, Etobicoke, ON M8Y 1B2</Text>
                    <Text style={styles.address}>orbmusicstudios@gmail.com</Text>
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
                    <Text style={{ fontSize: 11, marginBottom: 3 }}>{clientName}</Text>
                    <Text style={{ fontSize: 11, color: '#666' }}>{clientEmail}</Text>
                </View>

                {/* Booking Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Session Type:</Text>
                        <Text style={styles.value}>{sessionType}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Rental Type:</Text>
                        <Text style={styles.value}>{rentalType}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Date & Time:</Text>
                        <Text style={styles.value}>{dateFormatter.format(startTime)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>End Time:</Text>
                        <Text style={styles.value}>{dateFormatter.format(endTime)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Duration:</Text>
                        <Text style={styles.value}>{durationHours.toFixed(1)} hours</Text>
                    </View>
                </View>

                {/* Pricing Breakdown */}
                <View style={styles.priceTable}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Rate</Text>
                        <Text style={styles.tableValue}>${pricing.hourlyRate}/hr</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Duration</Text>
                        <Text style={styles.tableValue}>{durationHours.toFixed(1)} hrs</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabel}>Subtotal</Text>
                        <Text style={styles.tableValue}>${pricing.subtotal}</Text>
                    </View>

                    {pricing.monthlyDiscount && (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Monthly Discount</Text>
                            <Text style={styles.tableValue}>-${pricing.monthlyDiscount}</Text>
                        </View>
                    )}

                    {pricing.gearStorageFee && (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableLabel}>Gear Storage</Text>
                            <Text style={styles.tableValue}>+${pricing.gearStorageFee}</Text>
                        </View>
                    )}

                    <View style={{ ...styles.tableRow, ...styles.totalRow }}>
                        <Text style={{ ...styles.tableLabel, ...styles.totalLabel }}>Total Due</Text>
                        <Text style={{ ...styles.tableValue, ...styles.totalValue }}>${pricing.total}</Text>
                    </View>
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
