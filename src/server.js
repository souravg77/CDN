import express from 'express';
import { config } from './config.js';

// Create Express application
const app = express();

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    environment: config.nodeEnv 
  });
});

// Server instance to allow external control
let server;

/**
 * Start the server
 * @returns {Promise<void>}
 */
export async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      resolve();
    });
  });
}

/**
 * Stop the server
 * @returns {Promise<void>}
 */
export async function stopServer() {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}

export default app;