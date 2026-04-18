import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/complaints-db',
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '70d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET || 'highly_secure_crypto_secret_vault_9921'
};
