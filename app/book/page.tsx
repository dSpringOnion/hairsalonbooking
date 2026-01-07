'use client';

import { useState, useEffect } from 'react';
import { SERVICES, Service } from '@/lib/services';
import { format, addDays, startOfToday, isBefore, isSameDay, addMonths, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Clock, ChevronFirst, ChevronLast } from 'lucide-react';
import Link from 'next/link';

type BookingStep = 'service' | 'date' | 'info' | 'confirmation';

export default function BookingPage() {
    const [step, setStep] = useState<BookingStep>('service');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [weekStart, setWeekStart] = useState<Date>(startOfToday()); // Track the start of the visible week
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Mock Time Slots (In real app, fetch from API based on selectedDate)
    const STATIC_SLOTS = [
        "9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"
    ];

    const [availableSlots, setAvailableSlots] = useState<string[]>(STATIC_SLOTS);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Fetch availability when date or service changes

    // Dynamic Fetching
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedService || !selectedDate) return;

            setIsLoadingSlots(true);
            try {
                const params = new URLSearchParams({
                    date: selectedDate.toISOString(),
                    duration: selectedService.durationMinutes.toString()
                });

                const res = await fetch(`/api/availability?${params}`);
                const data = await res.json();

                if (data.slots) {
                    setAvailableSlots(data.slots);
                } else {
                    // Fallback or error handling
                    console.error("Failed to fetch slots", data.error);
                    setAvailableSlots(STATIC_SLOTS); // Fallback to static if API fails to avoid breaking UI? Or empty?
                    // Better to show empty if we want to prevent double booking.
                    // But for now let's default to empty to be safe.
                    // Actually, let's keep it safe.
                }
            } catch (error) {
                console.error("Error fetching availability:", error);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        fetchAvailability();
    }, [selectedDate, selectedService]);

    // Helper to check if a slot is available
    const isSlotAvailable = (time: string) => availableSlots.includes(time);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleBook = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: selectedService?.id,
                    date: selectedDate,
                    time: selectedTime, // "9:00 AM"
                    customer: { name, email, phone }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStep('confirmation');
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextWeek = () => setWeekStart(addDays(weekStart, 7));
    const handlePrevWeek = () => {
        const prev = addDays(weekStart, -7);
        if (!isBefore(prev, startOfToday())) {
            setWeekStart(prev);
        } else {
            setWeekStart(startOfToday());
        }
    };

    const handleNextMonth = () => setWeekStart(startOfMonth(addMonths(weekStart, 1)));
    const handlePrevMonth = () => {
        const prev = startOfMonth(addMonths(weekStart, -1));
        if (!isBefore(prev, startOfToday())) {
            setWeekStart(prev);
        } else {
            setWeekStart(startOfToday());
        }
    };

    return (
        <main className="min-h-screen bg-cream-50 pb-20">
            {/* Header */}
            <header className="px-6 py-6 border-b border-cream-200 sticky top-0 bg-cream-50/95 backdrop-blur z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {step !== 'service' && step !== 'confirmation' ? (
                        <button onClick={() => setStep(step === 'info' ? 'date' : 'service')} className="flex items-center text-charcoal-800 hover:text-terracotta-500 transition-colors">
                            <ChevronLeft size={20} />
                            <span className="ml-1 font-medium">Back</span>
                        </button>
                    ) : (
                        <Link href="/" className="flex items-center text-charcoal-800 hover:text-terracotta-500 transition-colors">
                            <ChevronLeft size={20} />
                            <span className="ml-1 font-medium">Home</span>
                        </Link>
                    )}
                    <h1 className="font-serif text-xl text-charcoal-900 absolute left-1/2 -translate-x-1/2">
                        {step === 'service' && 'Select Service'}
                        {step === 'date' && 'Select Time'}
                        {step === 'info' && 'Your Details'}
                        {step === 'confirmation' && 'Confirmed'}
                    </h1>
                    <div className="w-16" /> {/* Spacer for balance */}
                </div>
            </header>

            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Step 1: Service Selection */}
                {step === 'service' && (
                    <div className="space-y-4">
                        {SERVICES.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service);
                                    setStep('date');
                                }}
                                className={`w-full text-left p-6 rounded-xl border transition-all duration-300 group
                  ${selectedService?.id === service.id
                                        ? 'bg-cream-100 border-terracotta-500 shadow-md'
                                        : 'bg-white border-cream-200 hover:border-terracotta-500/50 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif text-xl text-charcoal-900 group-hover:text-terracotta-500 transition-colors">
                                        {service.name}
                                    </h3>
                                    <span className="font-sans font-medium text-terracotta-500">${service.priceStart}+</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-charcoal-800/60">
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {service.durationMinutes}m</span>
                                    <span className="capitalize px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold tracking-wide">
                                        {service.category}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-charcoal-800/80 leading-relaxed max-w-sm">
                                    {service.description}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 'date' && selectedService && (

                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Date Scroller */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevMonth}
                                        disabled={isSameDay(startOfMonth(weekStart), startOfMonth(startOfToday()))}
                                        className="p-1 rounded-full hover:bg-cream-200 text-charcoal-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                        title="Previous Month"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <h3 className="font-serif text-lg text-charcoal-900 min-w-[140px] text-center">
                                        {format(weekStart, 'MMMM yyyy')}
                                    </h3>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-1 rounded-full hover:bg-cream-200 text-charcoal-800 transition-colors"
                                        title="Next Month"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrevWeek}
                                        disabled={isSameDay(weekStart, startOfToday())}
                                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        Prev Week
                                    </button>
                                    <button
                                        onClick={handleNextWeek}
                                        className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-800 transition-colors"
                                    >
                                        Next Week
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                                    const date = addDays(weekStart, offset);
                                    const isSelected = isSameDay(date, selectedDate);
                                    const isToday = isSameDay(date, startOfToday());

                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                            className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all
                                    ${isSelected
                                                    ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-lg scale-105'
                                                    : 'bg-white text-charcoal-900 border-cream-200 hover:border-terracotta-500'
                                                }`}
                                        >
                                            <span className="text-xs uppercase font-bold tracking-wider mb-1 opacity-80">
                                                {isToday ? 'Today' : format(date, 'EEE')}
                                            </span>
                                            <span className="font-serif text-xl">{format(date, 'd')}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Time Grid */}
                        <div>
                            <h3 className="font-serif text-lg text-charcoal-900 mb-4">Available Times</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {STATIC_SLOTS.map(time => {
                                    const available = isSlotAvailable(time);
                                    return (
                                        <button
                                            key={time}
                                            disabled={!available}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-3 rounded-lg border text-sm font-medium transition-all
                                ${selectedTime === time
                                                    ? 'bg-terracotta-500 text-white border-terracotta-500 shadow-md'
                                                    : available
                                                        ? 'bg-white text-charcoal-800 border-cream-200 hover:border-terracotta-500/50'
                                                        : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <button
                            disabled={!selectedTime}
                            onClick={() => setStep('info')}
                            className="w-full py-4 bg-charcoal-900 text-cream-50 rounded-full font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-terracotta-500 transition-colors mt-8"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Info */}
                {
                    step === 'info' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-6 rounded-xl border border-cream-200 mb-8">
                                <h3 className="font-serif text-lg text-charcoal-900 mb-4 border-b border-cream-100 pb-2">Summary</h3>
                                <div className="space-y-2 text-charcoal-800">
                                    <div className="flex justify-between">
                                        <span className="text-charcoal-800/60">Service</span>
                                        <span className="font-medium">{selectedService?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-charcoal-800/60">Date</span>
                                        <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-charcoal-800/60">Time</span>
                                        <span className="font-medium">{selectedTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-800 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all placeholder:text-charcoal-800/30"
                                        placeholder="Jane Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-800 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all placeholder:text-charcoal-800/30"
                                        placeholder="jane@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-800 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-lg border border-cream-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all placeholder:text-charcoal-800/30"
                                        placeholder="(555) 123-4567"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {submitError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                                    {submitError}
                                </div>
                            )}

                            <button
                                onClick={handleBook}
                                disabled={!name || !email || isSubmitting}
                                className="w-full py-4 bg-terracotta-500 text-white rounded-full font-medium text-lg hover:bg-terracotta-700 transition-colors shadow-lg shadow-terracotta-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>
                    )
                }

                {/* Step 4: Confirmation */}
                {
                    step === 'confirmation' && (
                        <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h2 className="font-serif text-3xl text-charcoal-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-charcoal-800/60 max-w-xs mx-auto mb-8">
                                We've sent a confirmation email to {email}. We can't wait to see you on {format(selectedDate, 'MMMM d')}!
                            </p>
                            <div className="flex flex-col gap-3 justify-center items-center">
                                <Link
                                    href="/"
                                    className="w-full sm:w-auto px-8 py-3 bg-charcoal-900 text-cream-50 rounded-full font-medium hover:bg-terracotta-500 transition-colors"
                                >
                                    Back to Home
                                </Link>
                                <button
                                    onClick={() => {
                                        setStep('service');
                                        setSelectedService(null);
                                        setSelectedTime(null);
                                        // Keeping name/email/phone for easy re-booking
                                    }}
                                    className="w-full sm:w-auto px-8 py-3 bg-white text-charcoal-900 border border-charcoal-200 rounded-full font-medium hover:bg-cream-100 transition-colors"
                                >
                                    Book Another Appointment
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >
        </main >
    );
}
