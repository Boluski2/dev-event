// 'use server';

// import Booking from '@/database/booking.model';

// import connectDB from "@/lib/mongodb";

// export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
//     try {
//         await connectDB();

//         await Booking.create({ eventId, slug, email });

//         return { success: true };
//     } catch (e) {
//         console.error('create booking failed', e);
//         return { success: false };
//     }
// }



// lib/actions/booking.actions.ts
'use server';

import Booking from '@/database/booking.model';
import connectDB from "@/lib/mongodb";
import { sendEmail } from '@/lib/email';
import { generateBookingConfirmationEmail } from '@/lib/email-templates';
import Event from '@/database/event.model'; 

export const createBooking = async ({ 
  eventId, 
  slug, 
  email 
}: { 
  eventId: string; 
  slug: string; 
  email: string; 
}) => {
  try {
    await connectDB();

    // Create the booking
    await Booking.create({ eventId, email });

    // Fetch event details for the email
    const event = await Event.findById(eventId).select('title date time location mode slug');
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Prepare email
    const eventInfo = {
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      mode: event.mode,
      slug: event.slug,
    };

    const emailContent = generateBookingConfirmationEmail(email, eventInfo);
    
    // Send confirmation email
    const emailSent = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailSent) {
      console.warn('Booking created but email failed to send');
      // You might want to log this to a monitoring service
    }

    return { success: true };
  } catch (e: any) {
    console.error('Create booking failed', e);
    
    // Handle specific errors
    if (e.code === 11000) {
      return { 
        success: false, 
        error: 'You have already booked this event' 
      };
    }
    
    if (e.message.includes('Event with ID')) {
      return { 
        success: false, 
        error: 'Event not found' 
      };
    }
    
    return { 
      success: false, 
      error: e.message || 'Failed to create booking' 
    };
  }
}