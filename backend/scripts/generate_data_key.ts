import 'dotenv/config';
import { KMSClient, GenerateDataKeyCommand } from '@aws-sdk/client-kms';

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

async function main() {
  const KeyId = process.env.PII_ENCRYPTION_KEY_ID;
  const region = process.env.PII_KMS_REGION || process.env.AWS_REGION || 'us-east-1';
  if (!KeyId) throw new Error('Missing PII_ENCRYPTION_KEY_ID');
  const kms = new KMSClient({ region });
  const out = await kms.send(
    new GenerateDataKeyCommand({
      KeyId,
      KeySpec: 'AES_256',
      EncryptionContext: parseEncContext(),
    })
  );
  const blobB64 = Buffer.from(out.CiphertextBlob as Uint8Array).toString('base64');
  // Print only the encrypted data key; discard plaintext.
  // eslint-disable-next-line no-console
  console.log(blobB64);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

