import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assertEnv } from './env.js';

dotenv.config();

export async function connectDB() {
  assertEnv();
  const uri = process.env.MONGODB_URI as string;
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, { autoIndex: true });
}

