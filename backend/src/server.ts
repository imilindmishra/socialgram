import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: false,
  })
);

app.use(express.json());

// Initialize passport (no sessions)
app.use(passport.initialize());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'socialgram-backend' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

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
