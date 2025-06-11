import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
export function createApp() {
  const app = express();

  // Basic health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  return app;
}

/**
 * Start the server
 * @param {number} [port] Optional port number, defaults to env PORT
 * @returns {Promise<import('http').Server>} HTTP Server instance
 */
export async function startServer(port) {
  const app = createApp();
  const serverPort = port || process.env.PORT || 3000;

  const server = createServer(app);

  return new Promise((resolve, reject) => {
    server.listen(serverPort, () => {
      console.log(`Server running on port ${serverPort}`);
      resolve(server);
    }).on('error', (error) => {
      console.error('Server startup error:', error);
      reject(error);
    });
  });
}

// Only start server if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export default createApp();