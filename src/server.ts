import express, { Application } from 'express';

/**
 * Creates and configures an Express application
 * @param port - The port number to listen on (defaults to 3000)
 * @returns An configured Express application instance
 */
export function createServer(port: number = 3000): Application {
  const app = express();

  // Basic health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });

  // Configure the server to listen on the specified port
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
}

// Only run the server if this file is being run directly (not imported)
if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  createServer(PORT);
}