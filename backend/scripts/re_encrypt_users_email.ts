import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db';
import { User } from '../src/models/User';
import { decryptPII } from '../src/lib/kms';
import { encrypt } from '../src/lib/encryption';

async function main() {
  await connectDB();
  const batchSize = 500;
  let processed = 0;

  // Only target users where emailEnc is not already in v1 format
  // If your existing ciphertexts may contain other formats, adjust this filter.
  const cursor = User.find({ $or: [ { emailEnc: { $exists: false } }, { emailEnc: { $not: /^v1:/ } } ] })
    .cursor();

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      const oldCt = doc.emailEnc || '';
      const plaintext = await decryptPII(oldCt);
      const newCt = await encrypt(plaintext);
      doc.emailEnc = newCt;
      await doc.save();
      processed++;
      if (processed % batchSize === 0) {
        console.log(`Processed ${processed} users...`);
      }
    } catch (err) {
      console.error(`Failed to re-encrypt user ${doc.id}:`, err);
    }
  }

  console.log(`Done. Total processed: ${processed}`);
  await mongoose.connection.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

