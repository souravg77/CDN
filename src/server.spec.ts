import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from './server';

describe('Express Server', () => {
  it('should create a server with a health check endpoint', async () => {
    const app = createServer(0); // Use port 0 for dynamic port assignment
    
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });

  it('should allow creating server with custom port', () => {
    const customPort = 5000;
    const app = createServer(customPort);
    
    expect(app).toBeDefined();
  });
});