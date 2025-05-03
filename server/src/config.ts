import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Define environment variables with defaults
interface IConfig {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// Set default values for all environment variables
const config: IConfig = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'task-db',
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};

// Validate required environment variables
const requiredEnvVars: (keyof IConfig)[] = ['JWT_SECRET', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(name => !config[name]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  if (config.NODE_ENV === 'production') {
    process.exit(1); // Exit in production, but continue in development with defaults
  }
}

// Log the configuration at startup
console.log('Environment configuration loaded:', {
  ...config,
  DB_PASSWORD: config.DB_PASSWORD ? '[REDACTED]' : '[MISSING]',
  JWT_SECRET: config.JWT_SECRET ? '[REDACTED]' : '[MISSING]',
});

export default config; 