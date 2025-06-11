import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import { createServer } from './server';

describe('Express Server', () => {
  let serverInstance: ReturnType<typeof createServer> | null = null;

  afterEach(async () => {
    if (serverInstance) {
      await serverInstance.close();
      serverInstance = null;
    }
  });

  it('should create a server that listens on a port', () => {
    serverInstance = createServer(0); // 0 means use a random available port
    expect(serverInstance.port).toBeGreaterThan(0);
  });

  it('should provide a health check endpoint', async () => {
    serverInstance = createServer(0);
    const response = await request(serverInstance.app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('should allow configuring a specific port', () => {
    const testPort = 8888;
    serverInstance = createServer(testPort);
    expect(serverInstance.port).toBe(testPort);
  });
});