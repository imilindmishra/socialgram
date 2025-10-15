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

describe('Search & Hashtags', () => {
  let mongo: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();
    const user = await User.create({ googleId: 'gid-sh', email: 's@example.com', name: 'Searcher', username: 'searcher' });
    token = signJwt({ sub: user.id, email: user.email, name: user.name });
    await request(app).post('/api/tweets').set('Authorization', `Bearer ${token}`).send({ text: 'Tweet about #OpenAI and @searcher' });
    await request(app).post('/api/tweets').set('Authorization', `Bearer ${token}`).send({ text: 'Another #openai tweet' });
    await request(app).post('/api/tweets').set('Authorization', `Bearer ${token}`).send({ text: 'Random text' });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  test('search tweets by text', async () => {
    const res = await request(app)
      .get('/api/search/tweets?q=OpenAI')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThanOrEqual(2);
  });

  test('list tweets by hashtag', async () => {
    const res = await request(app)
      .get('/api/hashtags/openai')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBeGreaterThanOrEqual(2);
  });
});

