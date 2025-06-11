import express from 'express';
import { AddressInfo } from 'net';

/**
 * Creates and configures an Express server
 * @param port - Optional port number to listen on, defaults to 3000
 * @returns An object with the server instance and a method to close it
 */
export function createServer(port = 3000) {
  const app = express();

  // Basic health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return {
    app,
    server,
    port: (server.address() as AddressInfo).port,
    close: () => new Promise<void>((resolve) => {
      server.close(() => {
        console.log('Server closed');
        resolve();
      });
    })
  };
}

// Only start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createServer();
}