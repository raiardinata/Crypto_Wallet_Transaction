import * as crypto from 'crypto';
import { Encrypt, Decrypt } from '../../src/encryption/encryption'; // Assuming your crypto functions are in a separate file

describe('Crypto Functions', () => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const text = 'Hello, World!';

  it('should encrypt and decrypt data correctly', () => {
    const encryptedData = Encrypt(text, key, iv);
    const decryptedData = Decrypt(encryptedData, key, iv);

    expect(decryptedData).toBe(text);
  });

  it('should not decrypt with the wrong key', () => {
    const wrongKey = crypto.randomBytes(32);

    const encryptedData = Encrypt(text, key, iv);
    const decryptedData = Decrypt(encryptedData, wrongKey, iv);

    expect(decryptedData).toBe('Bad Decryption. Wrong Encryption/Iv Key');
  });

  it('should not decrypt with the wrong IV', () => {
    const wrongIv = crypto.randomBytes(32);

    const encryptedData = Encrypt(text, key, iv);
    const decryptedData = Decrypt(encryptedData, key, wrongIv);

    expect(decryptedData).toBe('Bad Decryption. Wrong Encryption/Iv Key');
  });
});
