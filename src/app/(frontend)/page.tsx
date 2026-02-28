'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface BookingFormData {
  client_name: string;
  client_email: string;
  client_phone: string;
  band_name: string;
  rental_type: string;
  session_type: string;
  preferred_date: string;
  preferred_time: string;
  duration: string;
  additional_info: string;
  gear_storage: string;
}

export default function Home() {
  const [formData, setFormData] = useState<BookingFormData>({
    client_name: '',
    client_email: '',
    client_phone: '',
    band_name: '',
    rental_type: '',
    session_type: '',
    preferred_date: '',
    preferred_time: '',
    duration: '',
    additional_info: '',
    gear_storage: 'No',
  });

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string>('collapseOne');
  const modalRef = useRef<HTMLDivElement>(null);
  const bookingModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize EmailJS
    if (!(window as any).emailjs) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => {
        (window as any).emailjs.init("y5-Zr5PiJXVG3AbTI");
      };
      document.head.appendChild(script);
    } else {
      (window as any).emailjs.init("y5-Zr5PiJXVG3AbTI");
    }

    // Handle security links
    handleSecurityLinks();
  }, []);

  const handleSecurityLinks = () => {
    if (window.location.hash === '#security') {
      openSecurityAccordion();
    }

    const securityLinks = document.querySelectorAll('a[href="#security"]');
    securityLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openSecurityAccordion();
        const securityElement = document.getElementById('security');
        if (securityElement) {
          securityElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  };

  const openSecurityAccordion = () => {
    const collapseElement = document.getElementById('collapseTwo');
    if (collapseElement && (window as any).bootstrap) {
      const bsCollapse = new (window as any).bootstrap.Collapse(collapseElement, {
        show: true,
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked ? 'Yes' : 'No',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = ['client_name', 'client_email', 'rental_type', 'session_type'];
    let isValid = true;

    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId) as HTMLInputElement;
      if (!field || !field.value.trim()) {
        if (field) {
          field.classList.add('is-invalid');
        }
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    if (!isValid) {
      showAlert('Please fill in all required fields (marked with *)', 'danger');
    }

    return isValid;
  };

  const showAlert = (message: string, type: 'success' | 'danger') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const sendBookingEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const templateParams: BookingFormData = {
      ...formData,
      preferred_date: formData.preferred_date
        ? new Date(formData.preferred_date).toLocaleDateString('en-CA')
        : 'Not provided',
    };

    try {
      await (window as any).emailjs.send('service_odf7xog', 'template_jav278e', templateParams);
      showAlert('Booking request sent successfully! We\'ll get back to you soon.', 'success');
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        band_name: '',
        rental_type: '',
        session_type: '',
        preferred_date: '',
        preferred_time: '',
        duration: '',
        additional_info: '',
        gear_storage: 'No',
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        const modal = (window as any).bootstrap.Modal.getInstance(bookingModalRef.current);
        if (modal) {
          modal.hide();
        }
      }, 2000);
    } catch (error) {
      console.log('Email sending failed:', error);
      showAlert('Failed to send booking request. Please try again or contact us directly.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    if ((window as any).bootstrap && modalRef.current) {
      const modal = new (window as any).bootstrap.Modal(modalRef.current);
      modal.show();
    }
  };

  const rehearsalImages = [
    { src: '/liveroom1.jpg', alt: 'Live Room View 1' },
    { src: '/liveroom2.jpg', alt: 'Live Room View 2' },
    { src: '/liveroom3.jpg', alt: 'Live Room View 3' },
    { src: '/liveroom4.jpg', alt: 'Live Room View 4' },
    { src: '/liveroom5.jpg', alt: 'Live Room View 5' },
  ];

  const controlImages = [
    { src: '/controlroom1.jpg', alt: 'Control Room View 1' },
    { src: '/controlroom2.jpg', alt: 'Control Room View 2' },
    { src: '/controlroom3.jpg', alt: 'Control Room View 3' },
    { src: '/controlroom4.jpg', alt: 'Control Room View 4' },
    { src: '/lounge_couch.jpg', alt: 'Lounge Couch' },
    { src: '/lounge_tv.jpg', alt: 'Lounge TV' },
  ];

  return (
    <>
      {/* HEADER */}
      <header>
        <h1 className="bebas">Welcome to Orb Studios</h1>
      </header>

      <main>
        {/* MAIN BLURB */}
        <section className="blurb">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center px-5">
              <div className="row align-items-center">
                <div className="col-lg-9">
                  {/* MAIN TEXT BLOCK */}
                  <div>
                    <h2 className="card-title fw-bold mt-5 mb-3 display-6">Welcome to Orb Studios</h2>
                    <p className="card-text fs-5 mb-4 lead">
                      We are a new rehearsal and recording space in <strong>Etobicoke, Ontario</strong>.
                    </p>
                    <p>
                      We offer a private yet personal music rehearsal space for bands and artists to rent on
                      either a monthly or hourly basis to create, practice, and inspire.
                    </p>
                    <p>
                      With a collection of gear on site, or the option for gear storage for our monthly rental
                      customers, <em>Orb Studios is the place to hole up and create your next masterpiece.</em>
                    </p>
                  </div>

                  {/* ICONS */}
                  <div className="row text-center feature-icons">
                    <div className="col-md-4 mb-3">
                      <a href="#rehearsal-room" className="text-decoration-none">
                        <div className="feature-card">
                          <i className="bi bi-boombox text-warning fs-1 mb-2"></i>
                          <h6 className="fw-bold">Professional Equipment</h6>
                          <small className="text-muted">Top-tier gear included</small>
                        </div>
                      </a>
                    </div>
                    <div className="col-md-4 mb-3">
                      <a href="#security">
                        <div className="feature-card">
                          <i className="bi bi-key-fill text-success fs-1 mb-2"></i>
                          <h6 className="fw-bold">Secure Storage</h6>
                          <small className="text-muted">Safe gear storage available</small>
                        </div>
                      </a>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="feature-card">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          data-bs-toggle="modal"
                          data-bs-target="#bookingModal"
                        >
                          <i className="bi bi-clock-history text-info fs-1 mb-2"></i>
                          <h6 className="fw-bold">Flexible Booking</h6>
                          <small className="text-muted">24/7 availability options</small>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ANIMATED ICON */}
                <div className="col-lg-3 mb-4 mb-lg-0">
                  <div className="record-container">
                    <div className="record-player">
                      <img src="/record.png" alt="Vinyl Record" className="rotating-record" />
                      <div className="record-center"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CALL TO ACTION / RATES BUTTON */}
            <div className="card-footer bg-transparent border-0 text-center pb-4">
              <a href="#rates" className="btn btn-primary btn-lg cta-button mx-2">
                <i className="bi bi-arrow-down me-2"></i>
                See the Rates
                <i className="bi bi-arrow-down ms-2"></i>
              </a>
              <a href="#rehearsal-room" className="btn btn-primary btn-lg cta-button mx-2">
                <i className="bi bi-arrow-down me-2"></i>
                See the Rooms
                <i className="bi bi-arrow-down ms-2"></i>
              </a>
            </div>
          </div>
        </section>

        {/* RATES */}
        <div className="mt-5"></div>
        <section className="rates m-2 p-2" id="rates">
          <div className="card monthly m-2 shadow">
            <h1 className="card-header card-header-title">All Inclusive Monthly Rate</h1>
            <div className="card-body public-sans">
              <h2 className="card-text">$400 per month</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">24 hours bookable 24/7 across each month</li>
                <li className="list-group-item">
                  Hours can be booked in any configuration (2 Hours, 24 Hour lockout, etc.)
                </li>
                <li className="list-group-item">Discount on Additional Hourly Rate</li>
                <li className="list-group-item">Complete access to Studio A</li>
                <li className="list-group-item">Complete Access to Control Room</li>
                <li className="list-group-item">Gear storage for amps, drums, etc.</li>
              </ul>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn btn-primary m-3"
                  data-bs-toggle="modal"
                  data-bs-target="#bookingModal"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="card hourly m-2 shadow">
            <h1 className="card-header card-header-title">Recording Studio Hourly Rate</h1>
            <div className="card-body public-sans">
              <h2 className="card-text">$50 per hour</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">2 Hour minimum blocks</li>
                <li className="list-group-item">
                  Hours can be booked in any configuration (2 Hours, 24 Hour lockout, etc.)
                </li>
                <li className="list-group-item">Complete access to Studio A</li>
                <li className="list-group-item">Complete Access to Control Room</li>
              </ul>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn btn-primary m-3"
                  data-bs-toggle="modal"
                  data-bs-target="#bookingModal"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="card hourly m-2 shadow">
            <h1 className="card-header card-header-title">Rehearsal Room Hourly Rate</h1>
            <div className="card-body public-sans">
              <h2 className="card-text">$30 per hour</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">No minimum blocks</li>
                <li className="list-group-item">
                  Hours can be booked in any configuration (2 Hours, 24 Hour lockout, etc.)
                </li>
                <li className="list-group-item">Complete access to Studio A</li>
              </ul>
              <div className="mt-auto">
                <button
                  type="button"
                  className="btn btn-primary m-3"
                  data-bs-toggle="modal"
                  data-bs-target="#bookingModal"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </section>
        <h1 className="mb-5 bebas">*All rates are before GST/HST*</h1>

        {/* REHEARSAL ROOM */}
        <div className="mt-5"></div>
        <section className="rehearsal-room m-2 p-2" id="rehearsal-room">
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title">Studio A Rehearsal Room</h2>
            </div>
            {/* IMAGE CAROUSEL */}
            <div id="rehearsalCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {rehearsalImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#rehearsalCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {rehearsalImages.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img
                      src={image.src}
                      className="d-block w-100 carousel-img clickable-image"
                      alt={image.alt}
                      onClick={() => handleImageClick(image.src, image.alt)}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#rehearsalCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#rehearsalCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="card-body">
              <h5 className="card-title">21 x 17 x 11 foot space with following gear included: </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">DW Drumkit with assorted cymbals and hardware.</li>
              <li className="list-group-item">Fender 100W Rumble Bass Amp</li>
              <li className="list-group-item">Orange Guitar Amp/Cab Combo</li>
              <li className="list-group-item">Fender '65 Deluxe Reverb</li>
              <li className="list-group-item">Allen & Heath ZED 4 Channel Mixer</li>
              <li className="list-group-item">Yorkville PA System/Speakers</li>
              <li className="list-group-item">Assorted Dynamic Mics (57s, 58s, 421, d112s, etc.)</li>
              <li className="list-group-item">
                Photos by{' '}
                <a href="https://www.instagram.com/snappedbybea/" target="_blank" rel="noopener noreferrer">
                  SnappedByBea
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* CONTROL ROOM */}
        <div className="mt-5"></div>
        <section className="control-room m-2 p-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-header-title">Mixing / Control Room</h2>
            </div>
            {/* IMAGE CAROUSEL */}
            <div id="controlCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {controlImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#controlCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : 'false'}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {controlImages.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <img
                      src={image.src}
                      className="d-block w-100 carousel-img clickable-image"
                      alt={image.alt}
                      onClick={() => handleImageClick(image.src, image.alt)}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#controlCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#controlCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="card-body">
              <h5 className="card-title">12.5 x 10.5 x 8 foot space with following capabilities: </h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Simple 2 Track Recording of Studio A Rehearsal.</li>
              <li className="list-group-item">Full Analogue to Digital recording up to 32 channels.</li>
              <li className="list-group-item">Allen & Heath ZED 32 Channel Mixer</li>
              <li className="list-group-item">Pro Tools / Logic / Reaper / Audacity / Ableton 10 Lite / GarageBand</li>
              <li className="list-group-item">
                88 Weighted Key Midi Keyboard and Native Instruments Komplete (with NI Maschine).
              </li>
              <li className="list-group-item">Slate VSX Headphone System</li>
              <li className="list-group-item">Assorted Mics (Dyanmics, Condensers, Ribbons, Emulation)</li>
              <li className="list-group-item">
                Photos by{' '}
                <a href="https://www.instagram.com/snappedbybea/" target="_blank" rel="noopener noreferrer">
                  SnappedByBea
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* CALENDAR */}
        <div className="mt-5"></div>
        <section className="calendar m-2 p-2">
          <h2 className="bebas text-center card-header-title">See what's available and</h2>
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary btn-xl px-5 py-3 fs-3"
              data-bs-toggle="modal"
              data-bs-target="#bookingModal"
            >
              Book Now
            </button>
          </div>
          <iframe
            className="google-cal"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FToronto&showPrint=0&showTabs=0&showCalendars=0&showTz=0&title=Orb%20Studios%20Calendar&src=b3JibXVzaWNzdHVkaW9zQGdtYWlsLmNvbQ&color=%23ff2968"
            style={{ borderWidth: 0 }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </section>

        {/* AMENITIES */}
        <h1 className="mt-5">Amenities</h1>
        <section className="amenities d-flex m-2 p-2">
          <div className="accordion m-2" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${openAccordion !== 'collapseOne' ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'collapseOne' ? '' : 'collapseOne')}
                  aria-expanded={openAccordion === 'collapseOne'}
                  aria-controls="collapseOne"
                >
                  Parking
                </button>
              </h2>
              <div
                id="collapseOne"
                className={`accordion-collapse collapse ${openAccordion === 'collapseOne' ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  Gear Loading and Unloading Zone Available. Free Parking available on first come first serve basis.
                  Street and Paid parking nearby.
                </div>
              </div>
            </div>
            <div className="accordion-item" id="security">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${openAccordion !== 'collapseTwo' ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'collapseTwo' ? '' : 'collapseTwo')}
                  aria-expanded={openAccordion === 'collapseTwo'}
                  aria-controls="collapseTwo"
                >
                  Gear Storage
                </button>
              </h2>
              <div
                id="collapseTwo"
                className={`accordion-collapse collapse ${openAccordion === 'collapseTwo' ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  For monthly rentals gear storage is available. We store amps, drums, microphones, etc. We will have
                  digital door locks and key locks for storage, as well as a security camera system on both the gear
                  storage and lounge.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${openAccordion !== 'collapseThree' ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'collapseThree' ? '' : 'collapseThree')}
                  aria-expanded={openAccordion === 'collapseThree'}
                  aria-controls="collapseThree"
                >
                  Lounge Area
                </button>
              </h2>
              <div
                id="collapseThree"
                className={`accordion-collapse collapse ${openAccordion === 'collapseThree' ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  A very large lounge is privately available during your sessions with tvs, streaming services,
                  kitchen and washroom access (including shower). Keurig Coffee machine, refrigerator, music sound
                  system, etc.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${openAccordion !== 'collapseFour' ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'collapseFour' ? '' : 'collapseFour')}
                  aria-expanded={openAccordion === 'collapseFour'}
                  aria-controls="collapseFour"
                >
                  Nearby Restaurants
                </button>
              </h2>
              <div
                id="collapseFour"
                className={`accordion-collapse collapse ${openAccordion === 'collapseFour' ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  A great area of Mimico with nearby coffee shops, pizza places, diner, bakeries, etc. There are also
                  a couple nearby sit down restaurants and convenience stores. All within walking distance.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${openAccordion !== 'collapseFive' ? 'collapsed' : ''}`}
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'collapseFive' ? '' : 'collapseFive')}
                  aria-expanded={openAccordion === 'collapseFive'}
                  aria-controls="collapseFive"
                >
                  Public Transportation
                </button>
              </h2>
              <div
                id="collapseFive"
                className={`accordion-collapse collapse ${openAccordion === 'collapseFive' ? 'show' : ''}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  Mimico Go station is a 5 minute walk, 2 stops from Union Station (15-30 minute intervals on
                  weekdays). There is also the nearby TTC 76 bus which runs along Royal York. We are also a 10 minute
                  drive from the Royal York Subway Station.
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="map-container m-2">
            <h5>See where your music will be made!</h5>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5776.719256508856!2d-79.49999108845148!3d43.61987335446548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b362373d78107%3A0x7a20c01ce45f75a8!2s124%20Portland%20St%2C%20Etobicoke%2C%20ON%20M8Y%201B2!5e0!3m2!1sen!2sca!4v1745854924075!5m2!1sen!2sca"
              width="400"
              height="300"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* ABOUT */}
        <h1 className="mt-5">About Us</h1>
        <section className="about d-flex m-2 p-2">
          <div className="aboutcard card m-3">
            <div className="card-header p-4">
              <h2 className="bebas">Morgan Clarke</h2>
            </div>
            <div className="card-body">
              <p>
                Morgan has recorded bands, artists, podcasts, and assorted live shows in cities like New York, Chicago,
                London, Los Angeles, Toronto, Seattle, and Denver.
              </p>
              <p>
                He has worked on podcasts that have been featured in the New York Times, the Washington Post, QEDCon,
                and the National Academy of Sciences.
              </p>
              <p>
                He has played in such venues as the Bitter End, Rockwood Music Hall, the Gypsy Tea Room, and even the
                Rose Bowl. He now calls Toronto, ON home and pretty much just jams and records with his band{' '}
                <a
                  href="https://open.spotify.com/artist/3B9orqUJOAa42fvR0TqtP5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Moodieboy.
                </a>
              </p>
            </div>
          </div>
          <div className="aboutcard card m-3">
            <div className="card-header p-4">
              <h2 className="bebas">Andrew Vargas</h2>
            </div>
            <div className="card-body">
              <p>
                Andrew is a local Mimico musician, multi instrumentalist, recording/mixing engineer all in all, music
                man.
              </p>
              <p>
                Born and raised on Lakeshore & Mimico. Andrew has been a part of Orb as a space since 2018 when it
                was first established by local visual artist, Joshua Augusto, as Orb Gallery. Since then they have both
                worked to create what the space is now. Year after year, reno after reno, the little private recording
                space in the back of Orb Gallery has now become Orb Music Studios.
              </p>
              <p>
                All the while Andrew has been working in the Toronto music scene, first as an audio tech and now as a
                local and international touring Lighting & Video Designer/Programmer/Operator.
              </p>
              <p>
                If he's not out of the country you can find him in the city at The Mod Club as the Senior Lighting
                Director or playing bass for local Blues Folk Rock band,{' '}
                <a href="https://ladymarge.com/" target="_blank" rel="noopener noreferrer">
                  Lady Marge.
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <h6 className="bebas">
          Contact us at <a href="mailto:orbmusicstudios@gmail.com">orbmusicstudios@gmail.com</a>
        </h6>
        <h6 className="bebas">
          Or Follow us on
          <a href="https://www.instagram.com/orb.musicstudios/" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
        </h6>
        <hr />
        <p>&copy; 2026 Orb Studios, Inc. All rights reserved.</p>
      </footer>

      {/* BOOKING MODAL */}
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
              <form id="bookingForm">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="clientName" className="form-label">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="clientName"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="clientEmail" className="form-label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="clientEmail"
                      name="client_email"
                      value={formData.client_email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="clientPhone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="clientPhone"
                      name="client_phone"
                      value={formData.client_phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="bandName" className="form-label">
                      Band/Artist Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bandName"
                      name="band_name"
                      value={formData.band_name}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="rentalType" className="form-label">
                      Rental Type *
                    </label>
                    <select
                      className="form-select"
                      id="rentalType"
                      name="rental_type"
                      value={formData.rental_type}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select rental type...</option>
                      <option value="Monthly Rate ($400/month)">Monthly Rate ($400/month)</option>
                      <option value="Recording Rate ($50/hour)">Hourly Recording Rate ($50/hour)</option>
                      <option value="Rehearsal Rate ($30/hour)">Hourly Rehearsal Rate ($30/hour)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="sessionType" className="form-label">
                      Session Type *
                    </label>
                    <select
                      className="form-select"
                      id="sessionType"
                      name="session_type"
                      value={formData.session_type}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select session type...</option>
                      <option value="Rehearsal Only">Rehearsal Only</option>
                      <option value="Recording Session">Recording Session</option>
                      <option value="Rehearsal + Recording">Rehearsal + Recording</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="preferredDate" className="form-label">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="preferredDate"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="preferredTime" className="form-label">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="preferredTime"
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">
                    Estimated Duration
                  </label>
                  <select
                    className="form-select"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                  >
                    <option value="">Select duration...</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="6 hours">6 hours</option>
                    <option value="8 hours">8 hours</option>
                    <option value="12 hours">12 hours</option>
                    <option value="24 hour lockout">24 hour lockout</option>
                    <option value="Custom duration">Custom duration</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="additionalInfo" className="form-label">
                    Additional Information
                  </label>
                  <textarea
                    className="form-control"
                    id="additionalInfo"
                    name="additional_info"
                    rows={4}
                    placeholder="Tell us about your project, any special equipment needs, alternative dates/times, or other details..."
                    value={formData.additional_info}
                    onChange={handleFormChange}
                  ></textarea>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gearStorage"
                    name="gear_storage"
                    checked={formData.gear_storage === 'Yes'}
                    onChange={handleFormChange}
                  />
                  <label className="form-check-label" htmlFor="gearStorage">
                    I'm interested in gear storage options (monthly rentals only)
                  </label>
                </div>
              </form>

              {/* Success/Error Messages */}
              {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="sendBookingBtn"
                onClick={sendBookingEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-2"></i>
                    Send Booking Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE MODAL */}
      <div
        className="modal fade"
        id="imageModal"
        tabIndex={-1}
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content bg-dark">
            <div className="modal-header border-0">
              <h5 className="modal-title text-white" id="imageModalLabel">
                {selectedImage?.alt}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center p-0">
              {selectedImage && <img id="modalImage" src={selectedImage.src} alt={selectedImage.alt} className="img-fluid w-100" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
