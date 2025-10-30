import crypto from 'crypto';
import { getDataKey } from './dataKey';
import { decryptPII as decryptLegacy } from './kms';

const VERSION = 'v1';
// Bind ciphertexts to a stable context to prevent misuse across fields/tables.
const AAD_STR = 'table=users;field=email';

function b64(buf: Buffer) {
  return buf.toString('base64');
}

function fromB64(s: string) {
  return Buffer.from(s, 'base64');
}

export async function encrypt(plaintext: string): Promise<string> {
  if (!plaintext) return '';
  const key = await getDataKey();
  const iv = crypto.randomBytes(12); 
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(AAD_STR, 'utf8'));
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}:${b64(iv)}.${b64(ct)}.${b64(tag)}`;
}

export async function decrypt(payload?: string | null): Promise<string> {
  if (!payload) return '';
  const [ver, rest] = payload.split(':', 2);
  if (ver !== VERSION || !rest) {
    // Backward-compatibility: fall back to legacy KMS-based decryption (or base64 in local)
    return decryptLegacy(payload);
  }
  const parts = rest.split('.');
  if (parts.length !== 3) return '';
  const [ivB64, ctB64, tagB64] = parts;
  const iv = fromB64(ivB64);
  const ct = fromB64(ctB64);
  const tag = fromB64(tagB64);
  const key = await getDataKey();
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAAD(Buffer.from(AAD_STR, 'utf8'));
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString('utf8');
  } catch {
    return '';
  }
}
