import { parse, isValid } from 'date-fns';
import Knex from 'knex';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'
import { UserData } from '../controllers/createUserController'
import * as crypto from 'crypto';

// Import your Knex db configuration
import knexConfig from '../dbConfig';
// Initialize Knex with the configuration
const knex = Knex(knexConfig);

// login interface
export interface LoginData {
  first_name:string,
  last_name:string,
  date_of_birth:string,
  address:string,
  city:string,
  province:string,
  country:string,
  phone_number:string,
  email:string,
  username:string,
  password:string,
  created_at:string,
  modify_at:string
}
let loginData: LoginData;

export async function IsValidLogin(email: string) : Promise<LoginData> {
  let resLoginData: LoginData;
  let username: string = '';
  try {
    const result = await knex
    .select('*')
        .from('users')
        .where('email', '=', email);

    // Handle the query result here
    // console.log('Query result:', result);
    if (result.length > 0) {
      // console.log("The array is empty.");
      result.forEach( (val) => {
        loginData = {
          first_name: val.first_name,
          last_name: val.last_name,
          date_of_birth: val.date_of_birth,
          address: val.address,
          city: val.city,
          province: val.province,
          country: val.country,
          phone_number: val.phone_number,
          email: val.email,
          username: val.username,
          password: val.password,
          created_at: val.created_at,
          modify_at: val.modify_at,
        };
        username = val.username;
      });
      resLoginData = loginData;
      loginData = {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        address: '',
        city: '',
        province: '',
        country: '',
        phone_number: '',
        email: '',
        username: '',
        password: '',
        created_at: '',
        modify_at: '',
      };

      const updateData = {
        modify_at: knex.raw('CURRENT_TIMESTAMP'),
      };

      await knex('users')
        .where('username', '=', username)
        .update(updateData);


      return resLoginData;
    } else {
      // console.log("The array is not empty.");
      return loginData;
    }
  } catch (error) {
    console.error('Error:', error);
    return loginData;
  }
}

export async function IsValidUsername(username: string): Promise<Boolean> {
  try {
    const result = await knex
    .select('username')
        .from('users')
        .where('username', 'like', username);

    // Handle the query result here
    // console.log('Query result:', result);
    if (result.length === 0) {
      // console.log("The array is empty.");
      return true;
    } else {
      // console.log("The array is not empty.");
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export function IsValidEmail(email: string): boolean {
  // Regular expression for a valid email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

export function IsAlphabetString(input: string, minChars: number, maxChars: number): boolean {
  // Input cant be empty
  if (input == '') {
    return false;
  }

  // Build the regex pattern dynamically
  const alphabetRegex = new RegExp(`^[A-Za-z]{${minChars},${maxChars}}$`);

  // Test the input string against the regular expression
  return alphabetRegex.test(input);
}

export function IsValidPhoneNumber(phoneNumber: string, country: CountryCode): boolean {
  // Front End must have country data and phone number
  const numb = parsePhoneNumber(phoneNumber, country)
  if (numb) {
    if(numb.isPossible() && numb.isValid()) {
      return true;
    }
  }
  return false;
}

export function ParseDate(input: string): Date | undefined {
  // Array of common date formats to try
  const dateFormats = [
    'yyyy-MM-dd',
    'dd/MM/yyyy',
    'yyyy-MM-dd HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
  ];

  for (const format of dateFormats) {
    let parsedDate = parse(input, format, new Date()); // Assuming 'en-US' locale

    if (isValid(parsedDate)) {
      let y: number = parsedDate.getFullYear();
      let m: number = parsedDate.getMonth();
      let d: number = parsedDate.getDate();
      parsedDate = new Date(Date.UTC(y,m,d))
      return parsedDate;
    }
  }

  return undefined; // If none of the formats match
}

export async function CreateUser(userData: UserData): Promise<boolean>{
  // User Table Columns
  const first_name = userData.first_name;
  const last_name = userData.last_name;
  const date_of_birth = userData.date_of_birth;
  let address = userData.address;
  const city = userData.city;
  const province = userData.province;
  const country = userData.country;
  const phone_number = userData.phone_number;
  const email = userData.email;
  const username = userData.username;
  const password = userData.password;
  const created_at = userData.created_at;
  const modify_at = userData.modify_at;
  let wallet_id: string = '';
  let user_id: number = 0;
  let id: any;

  // Insert the new user into the "users" table
  id = await knex('users').insert({
    first_name,
    last_name,
    date_of_birth,
    address,
    city,
    province,
    country,
    phone_number,
    email,
    username,
    password,
    created_at,
    modify_at
  });

  if (!id) {
    console.log('Error inserting users data');
    return false;
  }

  const walletEncrypt = generateSHA256Hash(username+email); // generate wallet id from username and email
  address = walletEncrypt;
  const currency = 'SW';
  const balance = '0.00';

  // create wallet
  id = await knex('wallet')
    .insert({
      address,
      currency,
      balance
    });

  if (!id) {
    console.log('Error inserting users data');
    await knex('users').where('id', user_id).delete();
    return false;
  }

  // get user_id
  const userRes = await knex
    .select('id')
    .from('users')
    .where('username', '=', username);
  userRes.forEach((val) => {
    user_id = val.id;
  });

  // get wallet_id
  const walletRes = await knex
    .select('id')
    .from('wallet')
    .where('address', '=', walletEncrypt);
  walletRes.forEach((val) => {
    wallet_id = val.id;
  });

  // create user wallet handler
  id = await knex('user_wallet_handler')
  .insert({
    user_id,
    wallet_id
  });

  if (!id) {
    await knex('users').where('id', user_id).delete();
    await knex('wallet').where('id', wallet_id).delete();
    console.log('Error inserting user_wallet_handler data');
    return false
  }

  return true;
}

function generateSHA256Hash(data: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

function create_UUID(): string{
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

export async function GetWallet(username: string): Promise<number> {
  // get wallet_id
  let walletBalance: number = -1;
  const walletRes = await knex('users')
    .select('wallet.balance')
    .join('user_wallet_handler', 'user_wallet_handler.user_id', '=', 'users.id') // Join posts with users on user_id
    .join('wallet', 'wallet.id', '=', 'user_wallet_handler.wallet_id') // Join posts with comments on post_id
    .where('users.username', '=', username);
  walletRes.forEach((val) => {
    walletBalance = val.balance;
  });
  return walletBalance;
}

export async function PayandTopUpWallet(username: string, balance: number, transaction_description: string): Promise<[boolean, string]> {
  let id: string;
  let walletBalance: number = -1;
  let wallet_id: string = '';

  // make purhistory
  const purhistory_id = create_UUID();
  id = purhistory_id;
  const purHistoryQ = await knex('purhistory')
    .insert({
      id,
      balance,
      transaction_description
    }).catch((e) => {
      console.log('Error inserting purhistory data' + e);
      return [false, 'Error inserting purhistory data' + e];
    });
  console.log(purHistoryQ);

  // get wallet_id
  let wallet_cur_balance: number = -1;
  const walletRes = await knex('users')
    .select('wallet.id', 'wallet.balance')
    .join('user_wallet_handler', 'user_wallet_handler.user_id', '=', 'users.id') // Join posts with users on user_id
    .join('wallet', 'wallet.id', '=', 'user_wallet_handler.wallet_id') // Join posts with comments on post_id
    .where('users.username', '=', username);
  console.log(walletRes);
  walletRes.forEach((val) => {
    wallet_id = val.id;
    wallet_cur_balance = +val.balance;
  });

  // make wallet_purhistory_handler
  const wallet_purhistory_handler_id = create_UUID();
  id = wallet_purhistory_handler_id;
  const wallet_purhistory_handlerQ = await knex('wallet_purhistory_handler')
    .insert({
      id,
      wallet_id,
      purhistory_id
    }).catch((e) => {
      console.log('Error inserting wallet_purhistory_handler data' + e);
      knex('purhistory').where('id', purhistory_id).delete();
      return [false, 'Error inserting wallet_purhistory_handler data' + e];
    });
    console.log(wallet_purhistory_handlerQ);


  // top up wallet
  const newBalance: number = balance + wallet_cur_balance;
  const updateData = {
    balance: newBalance,
  };
  const walletQ = await knex('wallet')
        .where('id', '=', wallet_id)
        .update(updateData);
    console.log(walletQ);


  // get wallet balance
  const walletBalanceRes = await knex('users')
    .select('wallet.balance')
    .join('user_wallet_handler', 'user_wallet_handler.user_id', '=', 'users.id') // Join posts with users on user_id
    .join('wallet', 'wallet.id', '=', 'user_wallet_handler.wallet_id') // Join posts with comments on post_id
    .where('users.username', '=', username);
    console.log(walletBalanceRes);

  walletBalanceRes.forEach((val) => {
    walletBalance = val.balance;
  });

  return [true, 'Transaction ' + transaction_description + ', Current Wallet Balance : ' + walletBalance];

}
