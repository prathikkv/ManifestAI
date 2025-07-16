import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one for development
function getEncryptionKey(): Buffer {
  const keyString = process.env.ENCRYPTION_KEY;
  
  if (!keyString) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production');
    }
    // Use a fixed key for development (NOT for production!)
    console.warn('⚠️  Using development encryption key. Set ENCRYPTION_KEY in production!');
    return Buffer.from('dev-key-32-chars-for-testing-only', 'utf8').subarray(0, KEY_LENGTH);
  }
  
  return Buffer.from(keyString, 'utf8').subarray(0, KEY_LENGTH);
}

// Encrypt sensitive data
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine iv + tag + encrypted data
    const result = iv.toString('hex') + tag.toString('hex') + encrypted;
    return result;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt sensitive data
export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey();
    
    // Extract components
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const tag = Buffer.from(encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), 'hex');
    const encrypted = encryptedData.slice((IV_LENGTH + TAG_LENGTH) * 2);
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Encrypt JSON objects
export function encryptJSON(obj: any): string {
  return encrypt(JSON.stringify(obj));
}

// Decrypt JSON objects
export function decryptJSON<T = any>(encryptedData: string): T {
  return JSON.parse(decrypt(encryptedData));
}

// Hash sensitive data for indexing (one-way)
export function hashForIndex(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Password hashing utilities
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Data anonymization utilities
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split('@');
  const anonymizedLocal = local.length > 3 
    ? local.substring(0, 2) + '*'.repeat(local.length - 2)
    : '*'.repeat(local.length);
  return `${anonymizedLocal}@${domain}`;
}

export function anonymizeText(text: string, preserveLength: boolean = true): string {
  if (preserveLength) {
    return '*'.repeat(text.length);
  }
  return '***';
}

// GDPR-compliant data masking
export function maskPersonalData(data: any): any {
  if (typeof data === 'string') {
    return anonymizeText(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(maskPersonalData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const masked: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Define fields that should be masked
      const sensitiveFields = [
        'email', 'phone', 'address', 'ip', 'userAgent',
        'personalityData', 'behaviorPatterns', 'content'
      ];
      
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        masked[key] = maskPersonalData(value);
      } else {
        masked[key] = value;
      }
    }
    return masked;
  }
  
  return data;
}