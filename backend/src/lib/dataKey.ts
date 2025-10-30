import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import crypto from 'crypto';

const localMode =
  process.env.NODE_ENV === 'test' || String(process.env.PII_ENCRYPTION_LOCAL_MODE).toLowerCase() === 'true';

const region = process.env.PII_KMS_REGION || process.env.AWS_REGION || 'us-east-1';
const kms = new KMSClient({ region });
const debugEnvelope = String(process.env.PII_ENVELOPE_DEBUG).toLowerCase() === 'true';

let cachedKey: Buffer | null = null;

function parseEncContext(): Record<string, string> | undefined {
  const raw = process.env.PII_DATA_KEY_ENC_CONTEXT_JSON;
  if (!raw) return undefined;
  try {
    const obj = JSON.parse(raw);
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) out[String(k)] = String(v);
    return out;
  } catch {
    throw new Error('Invalid JSON in PII_DATA_KEY_ENC_CONTEXT_JSON');
  }
}

export async function getDataKey(): Promise<Buffer> {
  if (cachedKey) return cachedKey;

  if (localMode) {
    const localB64 = process.env.PII_DATA_KEY_PLAINTEXT_B64;
    if (localB64 && localB64.length > 0) {
      cachedKey = Buffer.from(localB64, 'base64');
      if (cachedKey.length !== 32) {
        throw new Error('PII_DATA_KEY_PLAINTEXT_B64 must decode to 32 bytes');
      }
      return cachedKey;
    }
    // Fallback deterministic dev key (32 bytes). Do NOT use in production.
    cachedKey = crypto.createHash('sha256').update('local-dev-key').digest();
    return cachedKey;
  }

  const encB64 = process.env.PII_DATA_KEY_CIPHERTEXT_B64;
  if (!encB64) {
    throw new Error('Missing PII_DATA_KEY_CIPHERTEXT_B64 for envelope encryption');
  }

  const CiphertextBlob = Buffer.from(encB64, 'base64');
  const out = await kms.send(
    new DecryptCommand({
      CiphertextBlob,
      EncryptionContext: parseEncContext(),
    })
  );
  const plaintext = Buffer.from(out.Plaintext as Uint8Array);
  if (plaintext.length !== 32) {
    throw new Error('Decrypted data key is not 32 bytes (AES-256)');
  }
  cachedKey = plaintext;
  if (debugEnvelope) {
    // eslint-disable-next-line no-console
    console.log('[envelope] DEK unwrapped via KMS and cached (one-time)');
  }
  return cachedKey;
}
