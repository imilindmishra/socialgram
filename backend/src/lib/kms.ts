import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const kms = new KMSClient({ region: "ap-south-1" });
const KeyId = process.env.PII_ENCRYPTION_KEY_ID!;

export async function encryptPII(plaintext: string) {
  if (!plaintext) return "";
  const out = await kms.send(new EncryptCommand({
    KeyId,
    Plaintext: Buffer.from(plaintext),
    EncryptionContext: { table: "users", field: "email" },
  }));
  return Buffer.from(out.CiphertextBlob as Uint8Array).toString("base64");
}

export async function decryptPII(ciphertextB64?: string | null) {
  if (!ciphertextB64) return "";
  const out = await kms.send(new DecryptCommand({
    CiphertextBlob: Buffer.from(ciphertextB64, "base64"),
    EncryptionContext: { table: "users", field: "email" },
  }));
  return Buffer.from(out.Plaintext as Uint8Array).toString("utf8");
}
