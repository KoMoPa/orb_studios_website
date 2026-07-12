import { MonthlyBookingConfirmationEmail } from '../src/lib/booking/email-templates';

export default function Preview() {
  return (
    <MonthlyBookingConfirmationEmail
      clientName="The Riffs"
      sessionDate="Tuesday, April 28, 2026"
      sessionTime="8:00 p.m. – 10:00 p.m."
      duration={2}
      monthlyIncluded={2}
      overageHours={0}
      overageCost={0}
      bookingId="hlutk9ksgkmnp8avhj8oj7p1i8"
      doorCode="4321"
    />
  );
}
