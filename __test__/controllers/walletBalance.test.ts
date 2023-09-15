import { GetWallet } from '../../src/function/function'
import dotenv from 'dotenv'

dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

// Encryption config
const config = {
  encryptionKey: process.env.ENCRYPTION_KEY!,
  iv: process.env.IV!,
}

describe('LoginUser', () => {
  it('should return true when result >= 0', async () => {
    let valid: boolean = false;
    const walletBalance = await GetWallet('address');
    if (walletBalance >= 0){
      valid = true;
    }
    expect(valid).toBe(true);
  });

  it('should return true when result -1', async () => {
    let valid: boolean = false;
    const walletBalance = await GetWallet('joe');
    if (walletBalance == -1){
      valid = true;
    }
    expect(valid).toBe(true);
  });
});
