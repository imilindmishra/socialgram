import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-google-id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-google-secret';

import { app } from '../../app';
import { connectDB } from '../../config/db';
import { User } from '../../models/User';
import { signJwt } from '../../utils/jwt';

describe('Engagements: retweet, quote, bookmark', () => {
  let mongo: MongoMemoryServer;
  let token: string;
  let tweetId: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
    const user = await User.create({ googleId: 'gid-eng', email: 'e@example.com', name: 'Engager' });
    token = signJwt({ sub: user.id, email: user.email, name: user.name });
    const createRes = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'base tweet' });
    tweetId = createRes.body.post._id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  test('retweet toggle', async () => {
    const on = await request(app)
      .post(`/api/tweets/${tweetId}/retweet`)
      .set('Authorization', `Bearer ${token}`);
    expect(on.status).toBe(200);
    const off = await request(app)
      .post(`/api/tweets/${tweetId}/retweet`)
      .set('Authorization', `Bearer ${token}`);
    expect(off.status).toBe(200);
  });

  test('quote tweet', async () => {
    const quote = await request(app)
      .post(`/api/tweets/${tweetId}/quote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'my quote' });
    expect(quote.status).toBe(201);
    expect(quote.body.post.caption).toBe('my quote');
    expect(quote.body.post.quoteOf).toBeTruthy();
  });

  test('bookmark toggle', async () => {
    const on = await request(app)
      .post(`/api/tweets/${tweetId}/bookmark`)
      .set('Authorization', `Bearer ${token}`);
    expect(on.status).toBe(200);
    expect(on.body.bookmarked).toBe(true);
    const off = await request(app)
      .post(`/api/tweets/${tweetId}/bookmark`)
      .set('Authorization', `Bearer ${token}`);
    expect(off.status).toBe(200);
    expect(off.body.bookmarked).toBe(false);
  });
});

