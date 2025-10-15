import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import timelineRoutes from './routes/timelineRoutes';
// Removed hashtag, search, notifications, and stream features
import tweetRoutes from './routes/tweetRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
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
app.use(requestLogger);

// Deprecation header for legacy Post routes
app.use((req, _res, next) => {
  if (req.path.startsWith('/api/posts')) {
    _res.setHeader('Deprecation', 'true');
    _res.setHeader('Sunset', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString());
  }
  next();
});

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
app.use('/api/timeline', timelineRoutes);
// (routes removed)
app.use('/api/tweets', tweetRoutes);

// Error handler
app.use(errorHandler);
