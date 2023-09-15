import { Decrypt } from '../../src/encryption/encryption'
import { IsValidLogin, LoginData } from '../../src/function/function'
import dotenv from 'dotenv'

dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

// Encryption config
const config = {
  encryptionKey: process.env.ENCRYPTION_KEY!,
  iv: process.env.IV!,
}

describe('LoginUser', () => {
  let valid: boolean = false;
  it('should return true when succeed login user', async () => {
    const loginRes = await IsValidLogin('email@email.com');
    if (loginRes.address != ''){
      valid = true;
    }
    expect(valid).toBe(true);
  });

  it('should return false when failed login user', async () => {
    const loginRes = await IsValidLogin('fail@email.com')
    if (loginRes.address == ''){
      valid = false;
    }
    expect(valid).toBe(false);
  });
});
