import crypto from 'crypto';
import { env } from '../config/env.config.js';

// AES-256 requires a precise 32-byte key. 
// We securely stretch the environment secret using scrypt to exactly 32 bytes.
const ENCRYPTION_KEY = crypto.scryptSync(env.ENCRYPTION_SECRET || 'dev_fallback_secret_encryption_key', 'solidsalt', 32);

export const encryptField = (text) => {
  if (!text) return text;
  
  // Create a 12-byte Initialization Vector (IV) for AES-GCM
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Auth tag validates the ciphertext wasn't tampered with
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Pack components into a single secure string
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptField = (text) => {
  if (!text) return text;
  
  // If the string doesn't follow the payload structure (e.g. data collected before encryption implementation), return pure plaintext
  if (!text.includes(':')) {
    return text;
  }
  
  try {
    const textParts = text.split(':');
    if (textParts.length !== 3) return text;

    const iv = Buffer.from(textParts[0], 'hex');
    const authTag = Buffer.from(textParts[1], 'hex');
    const encryptedText = Buffer.from(textParts[2], 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Fail silently returning original text in dev mode if keys change
    return text;
  }
};
