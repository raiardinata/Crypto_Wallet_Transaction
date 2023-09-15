import { CreateUser } from '../../src/function/function'
import { Encrypt } from '../../src/encryption/encryption'
import { UserData } from '../../src/controllers/createUserController'
import dotenv from 'dotenv'
import Knex from 'knex'

// Import your Knex db configuration
import knexConfig from '../../src/dbConfig';
// Initialize Knex with the configuration
const knex = Knex(knexConfig);

dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

// Encryption config
const config = {
  encryptionKey: process.env.ENCRYPTION_KEY!,
  iv: process.env.IV!,
}

describe('CreateUser', () => {
  it('should return true when succeed creating user', async () => {

    const encPassword = Encrypt('encPassword', Buffer.from(config.encryptionKey), Buffer.from(config.iv));
    const genericDate: Date = new Date();
    const utcDate: Date = new Date(Date.UTC(genericDate.getFullYear(),genericDate.getMonth(),genericDate.getDate()));

    // User Table Columns
    const userData: UserData = {
      first_name: 'first_name',
      last_name: 'last_name',
      date_of_birth: '1992-05-26',
      address: 'address',
      city: 'city',
      province: 'province',
      country: 'ID', // front end must have country data to validate phone number
      phone_number: '081252185495',
      email: 'emailuser@email.com',
      username: 'username',
      password: encPassword,
      created_at: utcDate, // assign utc date
      modify_at: utcDate // assign utc date
    }
    let res1: Boolean = await CreateUser(userData);
    await knex('users').where('username', userData.username).delete();
    expect(res1).toBe(true);
  });
});
