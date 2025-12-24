// import mongoose, { type Mongoose } from "mongoose";

// // Prefer MONGODB_URI (common convention), but fall back to MONGODB_URL.
// const MONGODB_URI = process.env.MONGODB_URI ?? process.env.MONGODB_URL;

// if (!MONGODB_URI) {
//   // Fail fast at module load so misconfiguration is obvious in all environments.
//   throw new Error(
//     "Missing MongoDB connection string. Set MONGODB_URI (preferred) or MONGODB_URL in your environment.",
//   );
// }

// // Help TypeScript understand the runtime guard above.
// const MONGODB_URI_STRING: string = MONGODB_URI;

// type MongooseConnectionCache = {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// };

// // In Next.js (especially during development with Fast Refresh), modules can be re-evaluated.
// // Storing the connection in a global cache prevents creating multiple connections.
// declare global {
//   // eslint-disable-next-line no-var
//   var mongooseCache: MongooseConnectionCache | undefined;
// }

// const globalCache = globalThis.mongooseCache;

// const cache: MongooseConnectionCache =
//   globalCache ?? { conn: null, promise: null };

// if (!globalCache) {
//   globalThis.mongooseCache = cache;
// }

// /**
//  * Connect to MongoDB via Mongoose.
//  *
//  * - Returns the already-established connection when available.
//  * - Reuses an in-flight connection promise to avoid races.
//  */
// export async function connectToDatabase(): Promise<Mongoose> {
//   if (cache.conn) return cache.conn;

//   if (!cache.promise) {
//     // Create the connection promise once and reuse it for all callers.
//     cache.promise = mongoose
//       .connect(MONGODB_URI_STRING, {
//         // Disables buffering so errors surface immediately if MongoDB is unreachable.
//         bufferCommands: false,
//       })
//       .then((m) => m);
//   }

//   cache.conn = await cache.promise;
//   return cache.conn;
// }



import mongoose from 'mongoose';

// Define the connection cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global object to include our mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;


// Initialize the cache on the global object to persist across hot reloads in development
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads.
 * @returns Promise resolving to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if one is in progress
  if (!cached.promise) {
    // Validate MongoDB URI exists
    if (!MONGODB_URI) {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    }
    const options = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, options).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;