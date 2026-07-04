import mongoose from "mongoose";
import { db_url } from './config.js';

async function connectDB() {
  if (!db_url) {
    throw new Error('Missing MongoDB connection string. Set MONGO_DB_URL or mongo_db_url in your environment.');
  }

  try {
    await mongoose.connect(db_url);
    console.log('DB connected');
  } catch (err) {
    console.error('DB connection error', err);

    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }

    throw err;
  }
}

export { connectDB };