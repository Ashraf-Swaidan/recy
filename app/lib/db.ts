import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

function assertMongoUri(): string {
  if (!MONGODB_URI?.trim()) {
    throw new Error(
      "MONGODB_URI is missing or empty. Add it to Render (or .env.local) with your Atlas connection string."
    );
  }
  return MONGODB_URI.trim();
}

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare the global namespace for NodeJS
declare global {
  namespace NodeJS {
    interface Global {
      mongoose: MongooseConn | undefined;
    }
  }
}

let cached: MongooseConn = (global as typeof globalThis & {
  mongoose: MongooseConn | undefined;
}).mongoose || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = (global as typeof globalThis & {
    mongoose: MongooseConn | undefined;
  }).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connect = async () => {
  if (cached.conn) return cached.conn;

  const uri = assertMongoUri();

  cached.promise =
    cached.promise ||
    mongoose.connect(uri, {
      dbName: "recyDb",
      bufferCommands: false,
      connectTimeoutMS: 30_000,
      serverSelectionTimeoutMS: 60_000,
      // Many hosts (including some cloud runtimes) route IPv6 poorly to Atlas; IPv4 avoids SRV → IPv6 dead ends.
      family: 4,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};