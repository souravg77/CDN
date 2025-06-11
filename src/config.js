import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development'
};