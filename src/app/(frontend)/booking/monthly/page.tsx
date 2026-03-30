'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MonthlyBookingCalendarComponent } from '@/components/BookingCalendar/MonthlyBookingCalendarComponent';

interface MonthlyClient {
  id: string;
  name: string;
  email: string;
  bandName?: string;
  monthlyHoursUsed: number;
  monthlyHoursCancelled: number;
  monthlyStartDate: string;
}

interface VerificationError {
  message: string;
}

export default function MonthlyBookingPage() {
  const [step, setStep] = useState<'verify' | 'book'>('verify');
  const [email, setEmail] = useState('');
  const [verificationError, setVerificationError] = useState<VerificationError | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [client, setClient] = useState<MonthlyClient | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch('/api/booking/monthly/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationError({ message: data.error || 'Verification failed' });
        return;
      }

      setClient(data.client);
      setStep('book');
    } catch (error) {
      setVerificationError({ message: 'Failed to verify email. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  }

  if (step === 'verify') {
    return (
      <div className="container pt-24 pb-8">
        <div className="prose dark:prose-invert max-w-none mb-12">
          <h1>Monthly Client Portal</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter your email to access the quick booking form
          </p>
        </div>

        <div className="max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  required
                  disabled={isVerifying}
                />
              </div>

              {verificationError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-300 text-sm">{verificationError.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Not a monthly client?{' '}
                <Link href="/booking" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Regular booking
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="container pt-24 pb-24">
      <div className="prose dark:prose-invert max-w-none mb-12">
        <h1>Quick Booking</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Welcome back, {client.name}!</p>
      </div>

      <MonthlyBookingCalendarComponent
        client={client}
        onBookingComplete={() => {
          // Could refresh client data or show a success message here
          // For now, the component handles the success messaging
        }}
      />

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setStep('verify');
            setClient(null);
            setEmail('');
          }}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
        >
          ← Sign out
        </button>
      </div>
    </div>
  );
}
