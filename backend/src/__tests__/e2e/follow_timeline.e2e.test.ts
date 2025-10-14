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

describe('Follow + Home Timeline', () => {
  let mongo: MongoMemoryServer;
  let tokenA: string;
  let tokenB: string;
  let userA: any;
  let userB: any;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    process.env.MONGODB_URI = uri;
    await connectDB();

    userA = await User.create({ googleId: 'gid-A', email: 'a@example.com', name: 'User A', username: 'usera' });
    userB = await User.create({ googleId: 'gid-B', email: 'b@example.com', name: 'User B', username: 'userb' });
    tokenA = signJwt({ sub: userA.id, email: userA.email, name: userA.name });
    tokenB = signJwt({ sub: userB.id, email: userB.email, name: userB.name });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  test('follow then see tweets on home timeline with pagination', async () => {
    // B creates two tweets
    const t1 = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ text: 'hello from B 1' });
    expect(t1.status).toBe(201);
    const t2 = await request(app)
      .post('/api/tweets')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ text: 'hello from B 2' });
    expect(t2.status).toBe(201);

    // A follows B
    const f = await request(app)
      .post('/api/users/userb/follow')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(f.status).toBe(200);
    expect(f.body.following).toBe(true);

    // A fetches home timeline (limit=1) and paginates
    const page1 = await request(app)
      .get('/api/timeline/home?limit=1')
      .set('Authorization', `Bearer ${tokenA}`);
    expect(page1.status).toBe(200);
    expect(page1.body.posts.length).toBe(1);
    expect(page1.body.nextCursor).toBeTruthy();

    const page2 = await request(app)
      .get(`/api/timeline/home?limit=1&cursor=${encodeURIComponent(page1.body.nextCursor)}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(page2.status).toBe(200);
    expect(page2.body.posts.length).toBe(1);
  });
});

