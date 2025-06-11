import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app, { startServer, stopServer } from './server.js';
import { config } from './config.js';

describe('Express Server', () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  it('should have a health check endpoint', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'healthy',
      environment: config.nodeEnv
    });
  });

  it('should use the correct port from config', () => {
    expect(config.port).toBe(3000);
  });
});