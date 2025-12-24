// import mongoose, {
//   type HydratedDocument,
//   type Model,
//   Schema,
// } from "mongoose";

// export type EventMode = "online" | "offline" | "hybrid" | (string & {});

// export type EventAttrs = {
//   title: string;
//   slug: string;
//   description: string;
//   overview: string;
//   image: string;
//   venue: string;
//   location: string;
//   date: string;
//   time: string;
//   mode: EventMode;
//   audience: string;
//   agenda: string[];
//   organizer: string;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type EventDocument = HydratedDocument<EventAttrs>;

// const isNonEmptyString = (value: unknown): boolean =>
//   typeof value === "string" && value.trim().length > 0;

// const isNonEmptyStringArray = (value: unknown): boolean =>
//   Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);

// // Simple slugify: lowercase, trim, collapse whitespace, keep alphanumerics and dashes.
// const slugify = (input: string): string =>
//   input
//     .trim()
//     .toLowerCase()
//     .replace(/['"]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "");

// // Normalizes a date string to ISO (YYYY-MM-DD) by validating it is parseable.
// const normalizeISODate = (input: string): string => {
//   const parsed = new Date(input);
//   if (Number.isNaN(parsed.getTime())) {
//     throw new Error("Invalid date: expected a parseable date string.");
//   }

//   // Store as date-only ISO for consistency.
//   return parsed.toISOString().slice(0, 10);
// };

// // Normalizes time into 24-hour HH:mm format (accepts HH:mm or h:mm AM/PM).
// const normalizeTime = (input: string): string => {
//   const raw = input.trim();
//   const ampmMatch = raw.match(/^([0-1]?\d):([0-5]\d)\s*([aApP][mM])$/);
//   if (ampmMatch) {
//     let hours = Number(ampmMatch[1]);
//     const minutes = Number(ampmMatch[2]);
//     const ampm = ampmMatch[3].toLowerCase();

//     if (hours < 1 || hours > 12) throw new Error("Invalid time: hours out of range.");

//     // Convert 12-hour to 24-hour.
//     if (ampm === "pm" && hours !== 12) hours += 12;
//     if (ampm === "am" && hours === 12) hours = 0;

//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
//   }

//   const hhmmMatch = raw.match(/^([0-1]\d|2[0-3]):([0-5]\d)$/);
//   if (hhmmMatch) return raw;

//   throw new Error("Invalid time: expected HH:mm or h:mm AM/PM.");
// };

// const EventSchema = new Schema<EventAttrs>(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Title is required.",
//       },
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Slug is required.",
//       },
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Description is required.",
//       },
//     },
//     overview: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Overview is required.",
//       },
//     },
//     image: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Image is required.",
//       },
//     },
//     venue: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Venue is required.",
//       },
//     },
//     location: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Location is required.",
//       },
//     },
//     date: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Date is required.",
//       },
//     },
//     time: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Time is required.",
//       },
//     },
//     mode: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Mode is required.",
//       },
//     },
//     audience: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Audience is required.",
//       },
//     },
//     agenda: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: isNonEmptyStringArray,
//         message: "Agenda must be a non-empty array of strings.",
//       },
//     },
//     organizer: {
//       type: String,
//       required: true,
//       trim: true,
//       validate: {
//         validator: isNonEmptyString,
//         message: "Organizer is required.",
//       },
//     },
//     tags: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: isNonEmptyStringArray,
//         message: "Tags must be a non-empty array of strings.",
//       },
//     },
//   },
//   {
//     // Automatically manages createdAt/updatedAt.
//     timestamps: true,
//     strict: true,
//   },
// );

// // Enforce uniqueness at the DB level and make slug lookups fast.
// EventSchema.index({ slug: 1 }, { unique: true });

// EventSchema.pre("save", function (this: EventDocument) {
//   // Only regenerate slug when the title changes (keeps URLs stable).
//   if (this.isModified("title")) {
//     this.slug = slugify(this.title);
//   }

//   // Normalize date/time into consistent formats for querying and display.
//   if (this.isModified("date")) {
//     this.date = normalizeISODate(this.date);
//   }
//   if (this.isModified("time")) {
//     this.time = normalizeTime(this.time);
//   }

//   // Defensive checks for required-but-empty values (e.g. "   ").
//   const requiredStrings: Array<keyof Pick<
//     EventAttrs,
//     | "title"
//     | "description"
//     | "overview"
//     | "image"
//     | "venue"
//     | "location"
//     | "date"
//     | "time"
//     | "mode"
//     | "audience"
//     | "organizer"
//     | "slug"
//   >> = [
//     "title",
//     "description",
//     "overview",
//     "image",
//     "venue",
//     "location",
//     "date",
//     "time",
//     "mode",
//     "audience",
//     "organizer",
//     "slug",
//   ];

//   for (const key of requiredStrings) {
//     if (!isNonEmptyString(this[key])) {
//       throw new Error(`${key} is required.`);
//     }
//   }

//   if (!isNonEmptyStringArray(this.agenda)) {
//     throw new Error("agenda must be a non-empty array of strings.");
//   }
//   if (!isNonEmptyStringArray(this.tags)) {
//     throw new Error("tags must be a non-empty array of strings.");
//   }
// });

// export const Event: Model<EventAttrs> =
//   (mongoose.models.Event as Model<EventAttrs> | undefined) ??
//   mongoose.model<EventAttrs>("Event", EventSchema);




import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook for slug generation and data normalization
EventSchema.pre('save', function (next) {
  const event = this as IEvent;

  // Generate slug only if title changed or document is new
  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date to ISO format if it's not already
  if (event.isModified('date')) {
    event.date = normalizeDate(event.date);
  }

  // Normalize time format (HH:MM)
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }

  next();
});

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
  // Handle various time formats and convert to HH:MM (24-hour format)
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);
  
  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
  }
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();
  
  if (period) {
    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }
  
  if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
    throw new Error('Invalid time values');
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Create unique index on slug for better performance
EventSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;