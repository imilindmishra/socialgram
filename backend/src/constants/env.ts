import dotenv from 'dotenv';
dotenv.config();

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
export const PORT = Number(process.env.PORT || 4000);

export const MONGODB_URI = process.env.MONGODB_URI || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';

