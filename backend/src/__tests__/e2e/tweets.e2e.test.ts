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

describe('Tweets API E2E (Phase 2 create payload)', () => {
  let mongo: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();

    const gid = `gid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const user = await User.create({
      googleId: gid,
      email: 't2@example.com',
      name: 'Tweet User',
      profilePicture: 'https://example.com/pp.png',
    });
    token = signJwt({ sub: user.id, email: user.email, name: user.name });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  test('create, list, like, and comment on a tweet', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'hello tweets', media: ['https://example.com/img.jpg'] });
    expect(createRes.status).toBe(201);
    expect(createRes.body.post.caption).toBe('hello tweets');
    const id = createRes.body.post._id as string;

    // List
    const listRes = await request(app)
      .get('/api/tweets')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.posts)).toBe(true);
    expect(listRes.body.posts.length).toBeGreaterThanOrEqual(1);

    // Like toggle
    const likeRes = await request(app)
      .post(`/api/tweets/${id}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(likeRes.status).toBe(200);
    expect(likeRes.body.post.likes.length).toBe(1);

    const unlikeRes = await request(app)
      .post(`/api/tweets/${id}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(unlikeRes.status).toBe(200);
    expect(unlikeRes.body.post.likes.length).toBe(0);

    // Comment
    const commentRes = await request(app)
      .post(`/api/tweets/${id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Nice!' });
    expect(commentRes.status).toBe(201);
    expect(commentRes.body.post.comments.at(-1)?.text).toBe('Nice!');
  });

  test('create text-only tweet (no media)', async () => {
    const res = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'text only' });
    expect(res.status).toBe(201);
    expect(res.body.post.caption).toBe('text only');
  });
});
