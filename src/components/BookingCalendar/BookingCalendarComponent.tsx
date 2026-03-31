'use client';

import { useState, useEffect } from 'react';
import { format, startOfToday, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isBefore, isToday, isEqual, getDay } from 'date-fns';

interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

interface RentalTypeOption {
  value: string;
  label: string;
  amount: number;
}

interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  bandName?: string;
  rentalType: string;
  duration: number;
  additionalInfo?: string;
}

// Will be populated from Payload rates collection
const DEFAULT_RENTAL_TYPE_OPTIONS: RentalTypeOption[] = [
  { value: '2', label: 'Hourly Rehearsal ($30/hr)', amount: 30 },
  { value: '3', label: 'Hourly Recording ($50/hr)', amount: 50 },
];

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
  { value: 24, label: 'Full Day (24 hours)' },
];

export function BookingCalendarComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(startOfToday()));
  const [rentalTypeOptions, setRentalTypeOptions] = useState<RentalTypeOption[]>(DEFAULT_RENTAL_TYPE_OPTIONS);
  const [successTimeout, setSuccessTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch rental types from Payload rates collection on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('/api/rates');
        if (response.ok) {
          const data = await response.json();
          const options: RentalTypeOption[] = data.docs
            .filter((rate: any) => rate.type === 'hourly')
            .map((rate: any) => {
              const amount = typeof rate.amount === 'number' ? rate.amount : parseFloat(String(rate.amount)) || 30;
              return {
                value: String(rate.id),
                label: `${rate.title} ($${amount}/hr)`,
                amount: amount,
              };
            });
          
          if (options.length > 0) {
            setRentalTypeOptions(options);
          }
        }
      } catch (err) {
        console.error('Failed to fetch rates:', err);
        // Fall back to default options
      }
    };
    fetchRates();
  }, []);

  // Sync formData rental type with available options
  useEffect(() => {
    const newValue = rentalTypeOptions[0]?.value || '2';
    setFormData((prev) => ({
      ...prev,
      rentalType: newValue,
    }));
  }, [rentalTypeOptions]);

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    bandName: '',
    rentalType: DEFAULT_RENTAL_TYPE_OPTIONS[0].value,
    duration: 1,
    additionalInfo: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Phone formatting
  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    return phoneNumber;
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      setSelectedTime(null);
      return;
    }

    const fetchSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/booking/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: format(selectedDate, 'yyyy-MM-dd'),
            durationHours: formData.duration,
            rentalType: formData.rentalType,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch available slots');
        }

        const data = await response.json();
        setAvailableSlots(data.slots);
        setSelectedTime(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch available slots');
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, formData.duration, formData.rentalType]);

  // Generate calendar days
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, startOfToday())) {
      setError('Cannot book dates in the past');
      return;
    }
    setSelectedDate(date);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          preferredDate: format(selectedDate, 'yyyy-MM-dd'),
          preferredTime: selectedTime,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();
      
      // Scroll to top of page to show success message
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
      
      setSuccess(
        '✓ Booking confirmed! Check your email for details.'
      );

      // Auto-dismiss success message after 5 seconds
      if (successTimeout) clearTimeout(successTimeout);
      const timeout = setTimeout(() => setSuccess(null), 5000);
      setSuccessTimeout(timeout);

      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        bandName: '',
        rentalType: rentalTypeOptions[0]?.value || '2',
        duration: 1,
        additionalInfo: '',
      });
      setSelectedDate(null);
      setSelectedTime(null);
      setAvailableSlots([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'clientPhone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value),
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const estimatedPrice = (() => {
    const selectedRate = rentalTypeOptions.find(option => option.value === formData.rentalType);
    const hourlyRate = selectedRate?.amount ?? 30;
    const hours = formData.duration;
    const subtotal = hourlyRate * hours;
    const hst = subtotal * 0.13;
    const total = subtotal + hst;
    return { subtotal: subtotal.toFixed(2), hst: hst.toFixed(2), total: total.toFixed(2) };
  })();

  return (
    <div className="w-full">
      {/* Success Message - Sticky at Top */}
      {success && (
        <div className="sticky top-0 z-50 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-4 text-center font-semibold">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12 px-6 lg:px-12">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Your Information</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="555-123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Band Name</label>
            <input
              type="text"
              name="bandName"
              value={formData.bandName}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Your band name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rental Type *</label>
            <select
              name="rentalType"
              value={formData.rentalType}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            >
              {rentalTypeOptions.map((option, index) => (
                <option key={`rental-${option.value}-${index}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration *</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleFormChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            >
              {DURATION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleFormChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              placeholder="Any special requests or details..."
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${estimatedPrice.subtotal}</p>
            
            <div className="border-t border-blue-200 dark:border-blue-800 my-3 pt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">HST (13%):</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${estimatedPrice.hst}</p>
            </div>
            
            <div className="border-t border-blue-200 dark:border-blue-800 mt-3 pt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Price:</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${estimatedPrice.total}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedDate || !selectedTime || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {submitting ? 'Booking...' : 'Complete Booking'}
          </button>
        </form>
      </div>

      {/* Right Column: Calendar */}
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
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days - with proper weekday alignment */}
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
                  <div className="bg-blue-600 dark:bg-blue-500 h-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
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
                  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                  const displayTime = `${displayHour}:${minutes} ${ampm}`;
                  const endHours = parseInt(slot.endTime.split(':')[0]);
                  const endAmpm = endHours >= 12 ? 'PM' : 'AM';
                  const endDisplayHour = endHours > 12 ? endHours - 12 : (endHours === 0 ? 12 : endHours);
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
                      <span className="text-xs opacity-75">
                        {endDisplayTime}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
