import { BookingConfirmationEmail } from '../src/lib/booking/email-templates';

export default function Preview() {
  return (
    <BookingConfirmationEmail
      clientName="Alex Johnson"
      rentalType="Rehearsal"
      sessionDate="Tuesday, April 28, 2026"
      sessionTime="8:00 p.m. – 11:00 p.m."
      totalPrice={135.59}
      hasInvoice={true}
    />
  );
}
