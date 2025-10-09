import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import { CLIENT_URL as CLIENT_ORIGIN } from './constants/env';

export const app = express();

const CLIENT_URL = CLIENT_ORIGIN;

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

