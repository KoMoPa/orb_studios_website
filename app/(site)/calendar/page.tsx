'use client';

import { useRef } from 'react';

export default function CalendarPage() {
  const bookingModalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <main>
        <section className="calendar-page m-2 p-2" style={{ width: '75%', margin: '40px auto' }}>
          <div className="card border-0 shadow-lg">
            <div className="card-header">
              <h1 className="card-header-title">Studio Availability</h1>
            </div>

            <div className="card-body text-center">
              <p className="lead mb-4">
                View our studio availability below and find the perfect time for your session. All times are in Eastern Time (ET).
              </p>

              {/* Google Calendar Embed */}
              <iframe
                className="google-cal"
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FToronto&showPrint=0&showTabs=0&showCalendars=0&showTz=0&title=Orb%20Studios%20Calendar&src=b3JibXVzaWNzdHVkaW9zQGdtYWlsLmNvbQ&color=%23ff2968"
                style={{ borderWidth: 0 }}
                frameBorder="0"
                scrolling="no"
              ></iframe>

              <div className="mt-5">
                <h3 className="bebas mb-4">Ready to book?</h3>
                <p className="mb-4">
                  Once you've found your ideal time slot, click the button below to submit your booking request. 
                  We'll confirm your session and send you all the details.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-lg cta-button px-5 py-3"
                  data-bs-toggle="modal"
                  data-bs-target="#bookingModal"
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Book Now
                </button>
              </div>
            </div>

            <div className="card-footer bg-transparent border-0">
              <div className="row mt-4 text-center">
                <div className="col-md-4 mb-3">
                  <h5 className="bebas">Monthly Rate</h5>
                  <p className="text-muted">$400/month - 24 hours bookable</p>
                </div>
                <div className="col-md-4 mb-3">
                  <h5 className="bebas">Recording Hourly</h5>
                  <p className="text-muted">$50/hour - 2 hour minimum</p>
                </div>
                <div className="col-md-4 mb-3">
                  <h5 className="bebas">Rehearsal Hourly</h5>
                  <p className="text-muted">$30/hour - No minimum</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BOOKING MODAL - Simplified for this page */}
      <div
        className="modal fade"
        id="bookingModal"
        tabIndex={-1}
        aria-labelledby="bookingModalLabel"
        aria-hidden="true"
        ref={bookingModalRef}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bookingModalLabel">
                <i className="bi bi-calendar-check me-2"></i>
                Book Your Session at Orb Studios
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="text-muted">Redirect to main booking form...</p>
              <p>
                Please use the booking form on our{' '}
                <a href="/" className="text-decoration-none">
                  homepage
                </a>{' '}
                to submit your complete booking request.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <a href="/#rates" className="btn btn-primary" data-bs-dismiss="modal">
                Go to Booking Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
