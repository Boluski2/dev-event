// import mongoose, {
//   type HydratedDocument,
//   type Model,
//   Schema,
//   Types,
// } from "mongoose";

// import { Event } from "./event.model";

// export type BookingAttrs = {
//   eventId: Types.ObjectId;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type BookingDocument = HydratedDocument<BookingAttrs>;

// const isNonEmptyString = (value: unknown): boolean =>
//   typeof value === "string" && value.trim().length > 0;

// // Pragmatic email validation (rejects obvious invalid formats).
// const isValidEmail = (email: string): boolean =>
//   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// const BookingSchema = new Schema<BookingAttrs>(
//   {
//     eventId: {
//       type: Schema.Types.ObjectId,
//       ref: "Event",
//       required: true,
//       index: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//       validate: {
//         validator: (value: unknown) =>
//           isNonEmptyString(value) && isValidEmail(String(value)),
//         message: "A valid email is required.",
//       },
//     },
//   },
//   {
//     // Automatically manages createdAt/updatedAt.
//     timestamps: true,
//     strict: true,
//   },
// );

// // Index on eventId for fast "list bookings by event" queries.
// BookingSchema.index({ eventId: 1 });

// BookingSchema.pre("save", async function (this: BookingDocument) {
//   // Validate the reference: prevent bookings for events that don't exist.
//   if (this.isNew || this.isModified("eventId")) {
//     const exists = await Event.exists({ _id: this.eventId });
//     if (!exists) {
//       throw new Error("Invalid eventId: referenced Event does not exist.");
//     }
//   }

//   // Normalize and validate email consistently.
//   this.email = this.email.trim().toLowerCase();
//   if (!isValidEmail(this.email)) {
//     throw new Error("Invalid email format.");
//   }
// });

// export const Booking: Model<BookingAttrs> =
//   (mongoose.models.Booking as Model<BookingAttrs> | undefined) ??
//   mongoose.model<BookingAttrs>("Booking", BookingSchema);



import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        return next(error);
      }
    } catch {
      const validationError = new Error('Invalid events ID format or database error');
      validationError.name = 'ValidationError';
      return next(validationError);
    }
  }

  next();
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per events per email
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;