'use client';

import { useState } from "react";
import posthog from "posthog-js";
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string; }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { success, error: bookingError } = await createBooking({ eventId, slug, email });

        if(success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            setError(bookingError || 'Booking creation failed');
            posthog.capture('booking_failed', { 
                eventId, 
                slug, 
                email, 
                error: bookingError 
            });
        }
        
        setLoading(false);
    }

    return (
        <div id="book-event">
            {submitted ? (
                <div className="success-message">
                    <p className="text-green-600 font-medium">Thank you for signing up!</p>
                    <p className="text-sm text-gray-600 mt-1">
                        A confirmation email has been sent to {email}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm mb-3">{error}</p>
                    )}

                    <button 
                        type="submit" 
                        className="button-submit w-full"
                        disabled={loading || !email}
                    >
                        {loading ? 'Booking...' : 'Book Your Spot'}
                    </button>
                </form>
            )}
        </div>
    )
}

export default BookEvent;