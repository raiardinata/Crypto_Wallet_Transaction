"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const encryption_1 = require("../encryption/encryption");
const function_1 = require("../function/function");
const knex_1 = __importDefault(require("knex"));
// Import your Knex db configuration
const dbConfig_1 = __importDefault(require("../dbConfig"));
// Initialize Knex with the configuration
const knex = (0, knex_1.default)(dbConfig_1.default);
// Encryption config
const config = {
    encryptionKey: process.env.ENCRYPTION_KEY,
    iv: process.env.IV,
};
const createUser = async (req, res) => {
    try {
        // Extract user data from the request body (assuming JSON request)
        const { first_name, last_name, date_of_birth, address, city, province, country, // front end must have country data to validate phone number
        phone_number, email, username, password } = req.body;
        // first_name validation
        if (!(0, function_1.IsAlphabetString)(first_name, 2, 20)) {
            console.error('Invalid First Name');
            res.status(400).json({ message: 'Bad Request. Invalid First Name[min 2 char, max 20 char].' });
        }
        // last_name validation
        if (!(0, function_1.IsAlphabetString)(last_name, 2, 20)) {
            console.error('Invalid Last Name');
            res.status(400).json({ message: 'Bad Request. Invalid Last Name[min 2 char, max 20 char].' });
        }
        // address validation
        if (!(0, function_1.IsAlphabetString)(address, 5, 40)) {
            console.error('Invalid Address');
            res.status(400).json({ message: 'Bad Request. Invalid Address[min 5 char, max 50 char].' });
        }
        // city validation
        if (!(0, function_1.IsAlphabetString)(address, 5, 40)) {
            console.error('Invalid City');
            res.status(400).json({ message: 'Bad Request. Invalid City[min 2 char, max 20 char].' });
        }
        // phone_number validation
        if (!(0, function_1.IsValidPhoneNumber)(phone_number, country)) {
            console.error('Invalid Phone Number');
            res.status(400).json({ message: 'Bad Request. Invalid Phone Number[ex: 0812-3456-7890, +6281234567890, 081234567890].' });
        }
        // email validation
        if (!(0, function_1.IsValidEmail)(email)) {
            console.error('Invalid email address');
            res.status(400).json({ message: 'Bad Request. Invalid email address.' });
        }
        // date_of_birth parsing and format it into yyyy/mm/dd
        let formattedDate;
        if ((0, function_1.ParseDate)(date_of_birth) === undefined) {
            console.error('Invalid Date of Birth');
            res.status(400).json({ message: 'Bad Request. Invalid Date of Birth.' });
        }
        else {
            const bod = (0, function_1.ParseDate)(date_of_birth);
            const year = bod.getFullYear();
            const month = (bod.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
            const day = bod.getDate().toString().padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        // encrypt password
        let encPassword = (0, encryption_1.Encrypt)(password, Buffer.from(config.encryptionKey), Buffer.from(config.iv));
        // username unique validation
        const resUser = await (0, function_1.IsValidUsername)('uniqueUsername');
        if (!resUser) {
            console.error('Invalid Username');
            res.status(400).json({ message: 'Bad Request. Invalid Username(not unique).' });
        }
        // Get UTC date
        const genericDate = new Date();
        const utcDate = new Date(Date.UTC(genericDate.getFullYear(), genericDate.getMonth(), genericDate.getDate()));
        const userData = {
            first_name: first_name,
            last_name: last_name,
            date_of_birth: formattedDate,
            address: address,
            city: city,
            province: province,
            country: country,
            phone_number: phone_number,
            email: email,
            username: username,
            password: encPassword,
            created_at: utcDate,
            modify_at: utcDate // assign utc date
        };
        const insertRes = await (0, function_1.CreateUser)(userData);
        if (!insertRes) {
            console.error('Invalid Username');
            res.status(400).json({ message: 'Bad Request. Failed to create user.' });
        }
        res.status(201).json({
            message: 'User created successfully',
            FIRSTNAME: userData.first_name,
            LASTNAME: userData.last_name,
            DATEOFBIRTH: userData.date_of_birth,
            ADDRESS: userData.address,
            CITY: userData.city,
            PROVINCE: userData.province,
            COUNTRY: userData.country,
            PHONENUMBER: userData.phone_number,
            EMAIL: userData.email,
            USERNAME: userData.username,
            CREATEDAT: userData.created_at,
            MODIFYAT: userData.modify_at,
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createUser = createUser;
