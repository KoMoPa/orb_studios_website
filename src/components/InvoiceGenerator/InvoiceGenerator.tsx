'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './InvoiceGenerator.module.scss';

interface InvoiceGeneratorFormData {
  clientName: string;
  clientEmail: string;
  bookingDate: string;
  startTime: string;
  duration?: number; // hours
  rentalType: 'hourly-rehearsal' | 'hourly-recording' | 'monthly';
  isMonthly: boolean;
  invoiceType: 'hourly' | 'monthly' | 'custom';
  customAmount?: number;
  customInvoiceDate?: string;
  customDescription?: string;
}

const MONTHLY_RATE = 400;
const HST_RATE = 0.13;

export function InvoiceGenerator() {
  const router = useRouter();
  const [formData, setFormData] = useState<InvoiceGeneratorFormData>({
    clientName: '',
    clientEmail: '',
    bookingDate: '',
    startTime: '09:00',
    duration: undefined,
    rentalType: 'hourly-rehearsal',
    isMonthly: false,
    invoiceType: 'hourly',
    customAmount: undefined,
    customInvoiceDate: '',
    customDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleInvoiceTypeChange = (type: 'hourly' | 'monthly' | 'custom') => {
    setFormData(prev => ({
      ...prev,
      invoiceType: type,
      isMonthly: type === 'monthly',
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.clientName.trim()) {
        throw new Error('Client name is required');
      }
      if (!formData.clientEmail.trim()) {
        throw new Error('Client email is required');
      }

      if (!formData.clientEmail.includes('@')) {
        throw new Error('Invalid email address');
      }

      if (formData.invoiceType === 'hourly') {
        // Hourly booking - more validation
        if (!formData.bookingDate) {
          throw new Error('Booking date is required');
        }
        if (!formData.startTime) {
          throw new Error('Start time is required');
        }
        if (!formData.duration || formData.duration < 1) {
          throw new Error('Duration must be at least 1 hour');
        }

        const bookingDateTime = new Date(`${formData.bookingDate}T${formData.startTime}`);
        if (isNaN(bookingDateTime.getTime())) {
          throw new Error('Invalid date/time');
        }
      } else if (formData.invoiceType === 'custom') {
        // Custom invoice validation
        if (!formData.customAmount || formData.customAmount <= 0) {
          throw new Error('Amount must be greater than 0');
        }
        if (!formData.customInvoiceDate) {
          throw new Error('Invoice date is required');
        }
        if (!formData.customDescription.trim()) {
          throw new Error('Invoice description is required');
        }
      }

      const payload: any = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        invoiceType: formData.invoiceType,
        rentalType: formData.rentalType,
      };

      if (formData.invoiceType === 'hourly') {
        payload.bookingDate = formData.bookingDate;
        payload.startTime = formData.startTime;
        payload.duration = formData.duration;
      } else if (formData.invoiceType === 'custom') {
        payload.customAmount = formData.customAmount;
        payload.customInvoiceDate = formData.customInvoiceDate;
        payload.customDescription = formData.customDescription;
      }

      const response = await fetch('/api/admin/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const result = await response.json();

      setSuccess(`Invoice sent to ${formData.clientEmail}!`);
      
      // Redirect back to admin page after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Generate Invoice</h2>
        <p className={styles.description}>Manually generate an invoice for a booking</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Client Information */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Client Information</legend>

            <div className={styles.formGroup}>
              <label htmlFor="clientName" className={styles.label}>
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="clientEmail" className={styles.label}>
                Client Email *
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                placeholder="e.g. john@example.com"
                required
                className={styles.input}
              />
            </div>
          </fieldset>

          {/* Booking Type Toggle */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Invoice Type</legend>
            
            <div className={styles.toggleContainer}>
              <button
                type="button"
                onClick={() => handleInvoiceTypeChange('hourly')}
                className={`${styles.toggleButton} ${formData.invoiceType === 'hourly' ? styles.active : ''}`}
              >
                Hourly Booking
              </button>
              <button
                type="button"
                onClick={() => handleInvoiceTypeChange('monthly')}
                className={`${styles.toggleButton} ${formData.invoiceType === 'monthly' ? styles.active : ''}`}
              >
                Monthly Rental - ${MONTHLY_RATE.toFixed(2)}
              </button>
              <button
                type="button"
                onClick={() => handleInvoiceTypeChange('custom')}
                className={`${styles.toggleButton} ${formData.invoiceType === 'custom' ? styles.active : ''}`}
              >
                Custom Invoice
              </button>
            </div>
          </fieldset>

          {/* Hourly Booking Fields */}
          {formData.invoiceType === 'hourly' && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Booking Details</legend>

              <div className={styles.formGroup}>
                <label htmlFor="rentalType" className={styles.label}>
                  Rental Type *
                </label>
                <select
                  id="rentalType"
                  name="rentalType"
                  value={formData.rentalType}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="hourly-rehearsal">Hourly Rehearsal</option>
                  <option value="hourly-recording">Hourly Recording</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bookingDate" className={styles.label}>
                  Booking Date *
                </label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.dateTimeRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startTime" className={styles.label}>
                    Start Time *
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="duration" className={styles.label}>
                    Duration (hours) *
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration || ''}
                    onChange={(e) => {
                      const hours = e.target.value ? parseInt(e.target.value) : undefined;
                      setFormData(prev => ({
                        ...prev,
                        duration: hours || undefined,
                      }));
                    }}
                    required
                    className={styles.input}
                  >
                    <option value="">Select duration...</option>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map(hour => (
                      <option key={hour} value={hour}>
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
          )}

          {/* Monthly Booking Note */}
          {formData.invoiceType === 'monthly' && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Monthly Rental</legend>
              <div className={styles.note}>
                <p>Monthly rental rate: <strong>${MONTHLY_RATE.toFixed(2)}</strong> (includes 13% HST)</p>
              </div>
            </fieldset>
          )}

          {/* Custom Invoice Fields */}
          {formData.invoiceType === 'custom' && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Custom Invoice Details</legend>

              <div className={styles.formGroup}>
                <label htmlFor="customAmount" className={styles.label}>
                  Amount (before HST) *
                </label>
                <input
                  type="number"
                  id="customAmount"
                  name="customAmount"
                  value={formData.customAmount || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      customAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    }));
                  }}
                  step="0.01"
                  min="0"
                  placeholder="e.g. 500.00"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="customInvoiceDate" className={styles.label}>
                  Invoice Date *
                </label>
                <input
                  type="date"
                  id="customInvoiceDate"
                  name="customInvoiceDate"
                  value={formData.customInvoiceDate}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="customDescription" className={styles.label}>
                  Description / Reason for Invoice *
                </label>
                <textarea
                  id="customDescription"
                  name="customDescription"
                  value={formData.customDescription}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      customDescription: e.target.value,
                    }));
                  }}
                  placeholder="e.g. Studio rental for special event, Equipment rental, Consultation fees, etc."
                  required
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Subtotal:</span>
                  <span>${(formData.customAmount || 0).toFixed(2)}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>HST (13%):</span>
                  <span>${((formData.customAmount || 0) * HST_RATE).toFixed(2)}</span>
                </div>
                <div className={styles.priceRowTotal}>
                  <span>Total:</span>
                  <span>${((formData.customAmount || 0) * (1 + HST_RATE)).toFixed(2)}</span>
                </div>
              </div>
            </fieldset>
          )}

          {/* Messages */}
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Generating Invoice...' : 'Generate & Download Invoice'}
          </button>
        </form>

        {/* Back Button */}
        <a href="/admin" className={styles.backButton}>
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
