// 1. /lib/mongodb.ts
import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string
if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local')

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: Mongoose | null, promise: Promise<Mongoose> | null } | undefined
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: { conn: Mongoose | null; promise: Promise<Mongoose> | null }
}

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null }
}

export default async function dbConnect(): Promise<Mongoose> {
  const cached = globalWithMongoose.mongooseCache!
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { dbName: 'auth-demo' })
  }
  cached.conn = await cached.promise
  return cached.conn
}