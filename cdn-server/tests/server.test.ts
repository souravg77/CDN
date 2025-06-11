import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { app, server } from '../src/server';

describe('CDN Server Basic Tests', () => {
  afterEach(() => {
    server.close();
  });

  it('should return server running message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('CDN Server is running');
  });
});