"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = exports.ParseDate = exports.IsValidPhoneNumber = exports.IsAlphabetString = exports.IsValidEmail = exports.IsValidUsername = exports.IsValidLogin = void 0;
const date_fns_1 = require("date-fns");
const knex_1 = __importDefault(require("knex"));
const libphonenumber_js_1 = __importDefault(require("libphonenumber-js"));
const crypto = __importStar(require("crypto"));
// Import your Knex db configuration
const dbConfig_1 = __importDefault(require("../dbConfig"));
// Initialize Knex with the configuration
const knex = (0, knex_1.default)(dbConfig_1.default);
let loginData;
async function IsValidLogin(email) {
    let resLoginData;
    let username = '';
    try {
        const result = await knex
            .select('*')
            .from('users')
            .where('email', '=', email);
        // Handle the query result here
        // console.log('Query result:', result);
        if (result.length > 0) {
            // console.log("The array is empty.");
            result.forEach((val) => {
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
        }
        else {
            // console.log("The array is not empty.");
            return loginData;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return loginData;
    }
}
exports.IsValidLogin = IsValidLogin;
async function IsValidUsername(username) {
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
        }
        else {
            // console.log("The array is not empty.");
            return false;
        }
    }
    catch (error) {
        console.error('Error:', error);
        return false;
    }
}
exports.IsValidUsername = IsValidUsername;
function IsValidEmail(email) {
    // Regular expression for a valid email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Test the email against the regular expression
    return emailRegex.test(email);
}
exports.IsValidEmail = IsValidEmail;
function IsAlphabetString(input, minChars, maxChars) {
    // Input cant be empty
    if (input == '') {
        return false;
    }
    // Build the regex pattern dynamically
    const alphabetRegex = new RegExp(`^[A-Za-z]{${minChars},${maxChars}}$`);
    // Test the input string against the regular expression
    return alphabetRegex.test(input);
}
exports.IsAlphabetString = IsAlphabetString;
function IsValidPhoneNumber(phoneNumber, country) {
    // Front End must have country data and phone number
    const numb = (0, libphonenumber_js_1.default)(phoneNumber, country);
    if (numb) {
        if (numb.isPossible() && numb.isValid()) {
            return true;
        }
    }
    return false;
}
exports.IsValidPhoneNumber = IsValidPhoneNumber;
function ParseDate(input) {
    // Array of common date formats to try
    const dateFormats = [
        'yyyy-MM-dd',
        'dd/MM/yyyy',
        'yyyy-MM-dd HH:mm:ss',
        'dd/MM/yyyy HH:mm:ss',
    ];
    for (const format of dateFormats) {
        let parsedDate = (0, date_fns_1.parse)(input, format, new Date()); // Assuming 'en-US' locale
        if ((0, date_fns_1.isValid)(parsedDate)) {
            let y = parsedDate.getFullYear();
            let m = parsedDate.getMonth();
            let d = parsedDate.getDate();
            parsedDate = new Date(Date.UTC(y, m, d));
            return parsedDate;
        }
    }
    return undefined; // If none of the formats match
}
exports.ParseDate = ParseDate;
async function CreateUser(userData) {
    // User Table Columns
    const first_name = userData.first_name;
    const last_name = userData.last_name;
    const date_of_birth = userData.date_of_birth;
    const address = userData.address;
    const city = userData.city;
    const province = userData.province;
    const country = userData.country;
    const phone_number = userData.phone_number;
    const email = userData.email;
    const username = userData.username;
    const password = userData.password;
    const created_at = userData.created_at;
    const modify_at = userData.modify_at;
    // Insert the new user into the "users" table
    const [id] = await knex('users').insert({
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
    }).catch(error => {
        console.log(error);
        return [0];
    });
    const user_id = id;
    if (id != 0) {
        const walletEncrypt = generateSHA256Hash(username + email); // generate wallet id from username and email
        const address = walletEncrypt;
        const currency = 'SW';
        const balance = 0.00;
        // create wallet
        const [id] = await knex('wallet')
            .insert({
            address,
            currency,
            balance
        }).catch(error => {
            console.log(error);
            return [0];
        });
        const wallet_id = id;
        if (id != 0) {
            // create user wallet handler
            const [id] = await knex('user_wallet_handler')
                .insert({
                user_id,
                wallet_id
            }).catch(error => {
                console.log(error);
                return [0];
            });
            if (id != 0) {
                return true;
            }
            // rollback
            await knex('users').where('id', id).delete();
            await knex('wallet').where('id', id).delete();
            console.log('failed creating user wallet handler');
            return false;
        }
        // rollback
        await knex('users').where('id', id).delete();
        console.log('failed creating wallet');
        return false;
    }
    return false;
}
exports.CreateUser = CreateUser;
function generateSHA256Hash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}
