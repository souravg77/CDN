import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createApp, startServer } from '../src/server.js';

describe('Express Server', () => {
  let server;

  afterEach(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  it('should create an Express app', () => {
    const app = createApp();
    expect(app).toBeTruthy();
  });

  it('should have a health check endpoint', async () => {
    const app = createApp();
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('should start server on a specified port', async () => {
    const testPort = 4444;
    server = await startServer(testPort);
    
    expect(server).toBeTruthy();
  });
});