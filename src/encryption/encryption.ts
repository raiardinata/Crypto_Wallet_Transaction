import * as crypto from 'crypto';

// Function to encrypt data using AES-256-CBC
export function Encrypt(text: string, key: Buffer, iv: Buffer): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

// Function to decrypt data using AES-256-CBC
export function Decrypt(encryptedData: string, key: Buffer, iv: Buffer): string {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    } catch (error) {
        // Handle decryption errors here, e.g., log the error
        console.error('Decryption failed:', error);
        return 'Bad Decryption. Wrong Encryption/Iv Key'; // Return string to indicate decryption failure
    }
}
