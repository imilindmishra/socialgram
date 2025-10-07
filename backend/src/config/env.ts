export const requiredEnv = [
  'MONGODB_URI',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'JWT_SECRET',
  'CLIENT_URL',
  'SERVER_URL'
] as const;

export type RequiredEnvKey = typeof requiredEnv[number];

export function assertEnv() {
  const missing: string[] = [];
  for (const key of requiredEnv) {
    if (!process.env[key]) missing.push(key);
  }
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}

