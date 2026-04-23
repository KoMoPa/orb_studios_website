'use client';

import { useState, useRef } from 'react';
import { format, startOfToday, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, isToday, isEqual, getDay } from 'date-fns';

interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface MonthlyClient {
  id: string;
  name: string;
  email: string;
  bandName?: string;
  monthlyHoursUsed: number;
  monthlyHoursCancelled: number;
  monthlyHoursIncluded: number;
  monthlyStartDate: string;
}

const DURATION_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4 hours' },
  { value: 5, label: '5 hours' },
  { value: 6, label: '6 hours' },
  { value: 7, label: '7 hours' },
  { value: 8, label: '8 hours' },
  { value: 9, label: '9 hours' },
  { value: 10, label: '10 hours' },
  { value: 11, label: '11 hours' },
  { value: 12, label: '12 hours' },
  { value: 13, label: '13 hours' },
  { value: 14, label: '14 hours' },
  { value: 15, label: '15 hours' },
  { value: 16, label: '16 hours' },
  { value: 17, label: '17 hours' },
  { value: 18, label: '18 hours' },
  { value: 19, label: '19 hours' },
  { value: 20, label: '20 hours' },
  { value: 21, label: '21 hours' },
  { value: 22, label: '22 hours' },
  { value: 23, label: '23 hours' },
  { value: 24, label: 'Full Day (24 hours)' },
];

interface MonthlyBookingCalendarComponentProps {
  client: MonthlyClient;
  onBookingComplete: () => void;
}

export function MonthlyBookingCalendarComponent({ client, onBookingComplete }: MonthlyBookingCalendarComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(startOfToday()));
  const [submitting, setSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Calculate available hours
  const hoursUsed = client.monthlyHoursUsed - client.monthlyHoursCancelled;
  const availableHours = Math.max(0, (client.monthlyHoursIncluded || 20) - hoursUsed);

  const fetchAvailability = async (day: Date, durationHours: number) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setSelectedTime(null);
    setAvailableSlots([]);
    setError(null);
    setLoading(true);

    try {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const response = await fetch('/api/booking/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: formattedDate, durationHours }),
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }

      const data = await response.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Could not load available times. Please try again.');
      console.error(err);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  };

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day);
    fetchAvailability(day, duration);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (selectedDate) {
      fetchAvailability(selectedDate, newDuration);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/booking/monthly/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: client.email,
          preferredDate: format(selectedDate, 'yyyy-MM-dd'),
          preferredTime: selectedTime,
          duration,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();

      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }

      setSuccess('✓ Booking confirmed! Check your email for details.');

      setTimeout(() => setSuccess(null), 5000);

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setDuration(1);
      setAvailableSlots([]);
      onBookingComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Success Message - Sticky at Top */}
      {success && (
        <div className="sticky top-0 z-50 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-4 text-center font-semibold">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 px-6 lg:px-12">
        {/* Left Column: Duration & Info */}
        <div className="lg:col-span-1">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            {/* Client Info (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client</label>
              <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                {client.name}
              </div>
            </div>

            {client.bandName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Band/Artist</label>
                <div className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                  {client.bandName}
                </div>
              </div>
            )}

            {/* Available Hours */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly Allocation</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{availableHours.toFixed(1)} hours</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">available this month</p>
            </div>

            {/* Duration Selector */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration *
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Info */}
            {duration > availableHours && availableHours > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">Overage Charges</p>
                <p className="text-xs text-yellow-800 dark:text-yellow-400 mt-1">
                  {(duration - availableHours).toFixed(1)} hour{duration - availableHours !== 1 ? 's' : ''} will be charged at 50% off
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || submitting}
              className="hidden lg:block w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        {/* Right Column: Calendar & Time Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar Month Picker */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Date</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), 32))}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl p-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{format(currentMonth, 'MMMM yyyy')}</h3>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-2"></div>
                ))}

                {/* Actual days of the month */}
                {daysInMonth.map((day) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isPast = isBefore(day, startOfToday());
                  const isSelected = selectedDate && isEqual(day, selectedDate);

                  return (
                    <button
                      key={`${day.getMonth()}-${day.getDate()}`}
                      onClick={() => handleDateSelect(day)}
                      disabled={isPast || !isCurrentMonth}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        !isCurrentMonth
                          ? 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed'
                          : isPast
                            ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 cursor-not-allowed'
                            : isSelected
                              ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Select Time: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                      style={{ 
                        animation: 'loadingBar 2s ease-in-out infinite',
                      }}
                    ></div>
                  </div>
                  <style>{`
                    @keyframes loadingBar {
                      0% { width: 10%; }
                      50% { width: 90%; }
                      100% { width: 10%; }
                    }
                  `}</style>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">Checking available times...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
                  No available time slots for this date. Please choose another date.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => {
                    // Format time to 12-hour format
                    const [hours, minutes] = slot.startTime.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    const displayTime = `${displayHour}:${minutes} ${ampm}`;
                    const endHours = parseInt(slot.endTime.split(':')[0]);
                    const endAmpm = endHours >= 12 ? 'PM' : 'AM';
                    const endDisplayHour = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;
                    const endDisplayTime = `${endDisplayHour}:${slot.endTime.split(':')[1]} ${endAmpm}`;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(slot.startTime)}
                        disabled={!slot.available}
                        className={`py-3 px-2 rounded-lg font-medium transition text-sm ${
                          !slot.available
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : selectedTime === slot.startTime
                              ? 'bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white'
                              : 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300'
                        }`}
                      >
                        {displayTime}
                        <br />
                        <span className="text-xs opacity-75">{endDisplayTime}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mobile-only confirm button: appears right below time slots */}
          <button
            form="booking-form"
            type="submit"
            disabled={!selectedDate || !selectedTime || submitting}
            className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
