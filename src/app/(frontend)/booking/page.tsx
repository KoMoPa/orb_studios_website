import type { Metadata } from 'next'
import { BookingCalendarComponent } from '@/components/BookingCalendar/BookingCalendarComponent'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Book your studio session at Orb Studios. Choose your preferred date and time, and get instant confirmation.',
}

export default function BookingPage() {
  return (
    <>
      <div className="container pt-24 pb-8">
        <div className="prose dark:prose-invert max-w-none mx-14">
          <h1 className="mb-4">Book Your Session</h1>
          <p className="text-lg text-gray-400">
            Select your preferred date and time below. Times blocked on our calendar will automatically be unavailable, and your booking will instantly create an event on our calendar and email you the details of your booking along with an invoice (all payments e-transfer to orbmusicstudios@gmail.com).
          </p>
        </div>
      </div>

      <div className="container pb-24">
        <BookingCalendarComponent />
      </div>
    </>
  )
}
