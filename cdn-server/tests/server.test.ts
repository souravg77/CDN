import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import { app, server } from '../src/server';

describe('Express Server', () => {
  it('should respond to root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'CDN Server Initialized' });
  });

  afterAll(() => {
    server.close();
  });
});