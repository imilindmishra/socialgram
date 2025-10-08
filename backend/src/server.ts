import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { CLIENT_URL as CLIENT_ORIGIN, PORT as APP_PORT } from './constants/env';

dotenv.config();

const app = express();

const CLIENT_URL = CLIENT_ORIGIN;
const PORT = APP_PORT;

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
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

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
