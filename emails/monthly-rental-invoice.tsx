import { MonthlyRentalInvoiceEmail } from '../src/lib/booking/email-templates';

export default function Preview() {
  return (
    <MonthlyRentalInvoiceEmail
      clientName="The Riffs"
      monthYear="June 2026"
      totalPrice={452.00}
      hasInvoice={true}
    />
  );
}
