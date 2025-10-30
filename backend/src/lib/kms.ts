import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

const TABLE = 'users';
const FIELD = 'email';

const localMode =
  process.env.NODE_ENV === 'test' || String(process.env.PII_ENCRYPTION_LOCAL_MODE).toLowerCase() === 'true';

const region = process.env.PII_KMS_REGION || process.env.AWS_REGION || 'us-east-1';
const kms = new KMSClient({ region });
const KeyId = process.env.PII_ENCRYPTION_KEY_ID!;

export async function encryptPII(plaintext: string) {
  if (!plaintext) return '';
  if (localMode) {
    return Buffer.from(plaintext, 'utf8').toString('base64');
  }
  const out = await kms.send(
    new EncryptCommand({
      KeyId,
      Plaintext: Buffer.from(plaintext),
      EncryptionContext: { table: TABLE, field: FIELD },
    })
  );
  return Buffer.from(out.CiphertextBlob as Uint8Array).toString('base64');
}

export async function decryptPII(ciphertextB64?: string | null) {
  if (!ciphertextB64) return '';
  if (localMode) {
    try {
      return Buffer.from(ciphertextB64, 'base64').toString('utf8');
    } catch {
      return '';
    }
  }
  const out = await kms.send(
    new DecryptCommand({
      CiphertextBlob: Buffer.from(ciphertextB64, 'base64'),
      EncryptionContext: { table: TABLE, field: FIELD },
    })
  );
  return Buffer.from(out.Plaintext as Uint8Array).toString('utf8');
}
