import { z } from 'zod';

export const EnvSchema = z.object({
  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  PORT: z.string().optional(),
  MONGODB_URI: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

export type ParsedEnv = z.infer<typeof EnvSchema>;

export function parseEnv(env: NodeJS.ProcessEnv): ParsedEnv {
  return EnvSchema.parse(env);
}

