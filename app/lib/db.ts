import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

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

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "recyDb",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};