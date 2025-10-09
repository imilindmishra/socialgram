import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { PORT as APP_PORT } from './constants/env';
import { app } from './app';

dotenv.config();

const PORT = APP_PORT;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
