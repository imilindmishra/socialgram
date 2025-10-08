import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assertEnv } from './env';
import { MONGODB_URI } from '../constants/env';

dotenv.config();

export async function connectDB() {
  assertEnv();
  const uri = MONGODB_URI as string;
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, { autoIndex: true });
}
