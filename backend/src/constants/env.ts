import dotenv from 'dotenv';
import { parseEnv } from '../validation/env';
dotenv.config();

const parsed = parseEnv(process.env);

export const CLIENT_URL = parsed.CLIENT_URL;
export const SERVER_URL = parsed.SERVER_URL;
export const PORT = Number(parsed.PORT || 4000);

export const MONGODB_URI = parsed.MONGODB_URI;
export const GOOGLE_CLIENT_ID = parsed.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = parsed.GOOGLE_CLIENT_SECRET;
export const JWT_SECRET = parsed.JWT_SECRET;
