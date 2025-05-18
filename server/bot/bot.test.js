// bot/bot.test.js

// Stub out PrismaClient to avoid initialization errors on NixOS
jest.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {}
    $disconnect() { return Promise.resolve(); }
  }
}));

import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './bot.js';

describe('Telegram Bot API Endpoints', () => {
  let token;
  const user = { id: 'test-user-id', email: 'test@example.com' };

  beforeAll(() => {
    process.env.JWT_SECRET = 'mytestsecret';
    token = jwt.sign(user, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Ensure any open Prisma connections are closed
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });

  test('GET /health-check returns 200 and message', async () => {
    const res = await request(app).get('/health-check');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Bot Server Up' });
  });

  test('POST /verify-channel without inviteLink returns error status', async () => {
    const res = await request(app)
      .post('/verify-channel')
      .send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('GET /generate-invite without params returns 400', async () => {
    const res = await request(app).get('/generate-invite');
    expect(res.status).toBe(400);
  });

  describe('Protected routes without token', () => {
    test('POST /register-group returns 401', async () => {
      const res = await request(app)
        .post('/register-group')
        .send({});
      expect(res.status).toBe(401);
    });

    test('GET /my-groups returns 401', async () => {
      const res = await request(app).get('/my-groups');
      expect(res.status).toBe(401);
    });

    test('GET /group/:id returns 401', async () => {
      const res = await request(app).get('/group/someid');
      expect(res.status).toBe(401);
    });

    test('POST /purchase-subscription returns 401', async () => {
      const res = await request(app)
        .post('/purchase-subscription')
        .send({});
      expect(res.status).toBe(401);
    });
  });
});
