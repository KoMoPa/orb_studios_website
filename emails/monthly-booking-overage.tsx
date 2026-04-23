import { MonthlyBookingConfirmationEmail } from '../src/lib/booking/email-templates';

export default function Preview() {
  return (
    <MonthlyBookingConfirmationEmail
      clientName="The Riffs"
      sessionDate="Tuesday, April 28, 2026"
      sessionTime="8:00 p.m. – 11:00 p.m."
      duration={3}
      monthlyIncluded={2}
      overageHours={1}
      overageCost={16.95}
      bookingId="hlutk9ksgkmnp8avhj8oj7p1i8"
    />
  );
}
