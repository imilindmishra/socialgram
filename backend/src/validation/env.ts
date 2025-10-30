import { z } from 'zod';

export const EnvSchema = z.object({
  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  PORT: z.string().optional(),
  MONGODB_URI: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  PII_ENCRYPTION_KEY_ID: z.string().min(1),
  // Optional KMS region override and local mode for tests/dev
  PII_KMS_REGION: z.string().min(1).optional(),
  PII_ENCRYPTION_LOCAL_MODE: z.string().optional(),
  // Envelope encryption: store only the KMS-encrypted data key in prod
  PII_DATA_KEY_CIPHERTEXT_B64: z.string().optional(),
  // Dev-only: allow providing a plaintext DEK to avoid real KMS in local/test
  PII_DATA_KEY_PLAINTEXT_B64: z.string().optional(),
  // Optional KMS EncryptionContext for the DEK (JSON string)
  PII_DATA_KEY_ENC_CONTEXT_JSON: z.string().optional(),
  // Optional debug flag to log one-time unwrap
  PII_ENVELOPE_DEBUG: z.string().optional(),

});

export type ParsedEnv = z.infer<typeof EnvSchema>;

export function parseEnv(env: NodeJS.ProcessEnv): ParsedEnv {
  return EnvSchema.parse(env);
}
