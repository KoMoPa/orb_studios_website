'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDays, format } from 'date-fns';

const BookingSchema = z.object({
    clientName: z.string().min(2, 'Name must be at least 2 characters'),
    clientEmail: z.string().email('Invalid email address'),
    clientPhone: z.string().optional(),
    bandName: z.string().optional(),
    preferredDate: z.string().refine((date) => {
        const d = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
    }, 'Date must be in the future'),
    preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
    duration: z.string().transform((val) => parseInt(val)),
    rentalType: z.enum(['monthly', 'hourly-recording', 'hourly-rehearsal']),
    sessionType: z.enum(['rehearsal', 'recording', 'rehearsal-recording']),
    additionalInfo: z.string().optional(),
    gearStorage: z.boolean().default(false),
});

type BookingFormData = z.infer<typeof BookingSchema>;

export default function BookingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<BookingFormData>({
        resolver: zodResolver(BookingSchema),
        defaultValues: {
            gearStorage: false,
            duration: '120',
        },
    });

    const selectedDate = watch('preferredDate');

    // Check availability when date changes
    const handleDateChange = async (date: string) => {
        if (!date) return;

        setCheckingAvailability(true);
        try {
            const response = await fetch('/api/booking/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Availability API error:', errorData);
                throw new Error(errorData.error || 'Failed to fetch availability');
            }

            const data = await response.json();
            setAvailableSlots(data.slots.map((s: any) => s.startTime));
        } catch (error) {
            console.error('Availability check error:', error);
            setAvailableSlots([]);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const onSubmit = async (data: BookingFormData) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/booking/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    duration: parseInt(data.duration.toString()),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Booking failed');
            }

            const result = await response.json();
            setSuccessMessage(
                `✅ Booking confirmed! Invoice and calendar invite sent to ${data.clientEmail}`
            );
            reset();
            setAvailableSlots([]);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Failed to complete booking. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const minDate = format(new Date(), 'yyyy-MM-dd');
    const maxDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Book Studio Time</h1>
                    <p className="text-gray-600">
                        Check availability and reserve your session at Orb Studios
                    </p>
                </div>

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700">{successMessage}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Client Info */}
                    <fieldset className="border-b pb-6">
                        <legend className="text-xl font-semibold text-gray-900 mb-4">
                            Your Information
                        </legend>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('clientName')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="John Doe"
                                />
                                {errors.clientName && (
                                    <p className="text-red-600 text-sm mt-1">{errors.clientName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    {...register('clientEmail')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="john@example.com"
                                />
                                {errors.clientEmail && (
                                    <p className="text-red-600 text-sm mt-1">{errors.clientEmail.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    {...register('clientPhone')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Band/Artist Name
                                </label>
                                <input
                                    type="text"
                                    {...register('bandName')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Your band name"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Booking Details */}
                    <fieldset className="border-b pb-6">
                        <legend className="text-xl font-semibold text-gray-900 mb-4">
                            Booking Details
                        </legend>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rental Type *
                                </label>
                                <select
                                    {...register('rentalType')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select rental type...</option>
                                    <option value="hourly-rehearsal">Rehearsal - $30/hr</option>
                                    <option value="hourly-recording">Recording - $50/hr</option>
                                    <option value="monthly">Monthly - $400/month</option>
                                </select>
                                {errors.rentalType && (
                                    <p className="text-red-600 text-sm mt-1">{errors.rentalType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Session Type *
                                </label>
                                <select
                                    {...register('sessionType')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select session type...</option>
                                    <option value="rehearsal">Rehearsal Only</option>
                                    <option value="recording">Recording Session</option>
                                    <option value="rehearsal-recording">Rehearsal + Recording</option>
                                </select>
                                {errors.sessionType && (
                                    <p className="text-red-600 text-sm mt-1">{errors.sessionType.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Preferred Date *
                                </label>
                                <input
                                    type="date"
                                    {...register('preferredDate', {
                                        onChange: (e) => handleDateChange(e.target.value),
                                    })}
                                    min={minDate}
                                    max={maxDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                {errors.preferredDate && (
                                    <p className="text-red-600 text-sm mt-1">{errors.preferredDate.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                </label>
                                <select
                                    {...register('duration')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="120">2 hours</option>
                                    <option value="180">3 hours</option>
                                    <option value="240">4 hours</option>
                                    <option value="360">6 hours</option>
                                    <option value="480">8 hours</option>
                                    <option value="1440">24 hours</option>
                                </select>
                            </div>

                            {selectedDate && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preferred Time * {checkingAvailability && '(checking...)'}
                                    </label>
                                    <select
                                        {...register('preferredTime')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Select time...</option>
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))
                                        ) : checkingAvailability ? (
                                            <option disabled>Checking availability...</option>
                                        ) : (
                                            <option disabled>No slots available</option>
                                        )}
                                    </select>
                                    {errors.preferredTime && (
                                        <p className="text-red-600 text-sm mt-1">{errors.preferredTime.message}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </fieldset>

                    {/* Additional Options */}
                    <fieldset className="border-b pb-6">
                        <legend className="text-xl font-semibold text-gray-900 mb-4">
                            Additional Options
                        </legend>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('gearStorage')}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                                />
                                <span className="ml-2 text-gray-700">
                                    Interested in gear storage? (Monthly rentals can store amps, drums, etc.)
                                </span>
                            </label>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Information
                            </label>
                            <textarea
                                {...register('additionalInfo')}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Tell us about your project, special equipment needs, or any other details..."
                            />
                        </div>
                    </fieldset>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-linear-to-r from-red-500 to-yellow-400 hover:from-red-600 hover:to-yellow-500 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all"
                        >
                            {isLoading ? 'Processing...' : 'Complete Booking'}
                        </button>
                        <button
                            type="reset"
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
                    <ol className="space-y-1 text-sm text-blue-800 list-decimal list-inside">
                        <li>Fill out your details and select your preferred date and time</li>
                        <li>We check availability against our calendar</li>
                        <li>Your booking is confirmed and an invoice is generated</li>
                        <li>You receive a confirmation email with calendar invite (iCal)</li>
                        <li>Your session is added to our Google Calendar</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
