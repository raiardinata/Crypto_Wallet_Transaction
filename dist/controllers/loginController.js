"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
// import jwt from 'jsonwebtoken'
const encryption_1 = require("../encryption/encryption");
const function_1 = require("../function/function");
const index_1 = require("../index");
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    const encrypt_key = process.env.ENCRYPTION_KEY;
    const iv_key = process.env.IV;
    // const secretKey = process.env.JWT_SECRET!;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const userWithEmail = await (0, function_1.IsValidLogin)(email);
    const isObjectEmpty = Object.keys(userWithEmail).every(key => userWithEmail[key] === undefined);
    if (isObjectEmpty)
        return res
            .status(400)
            .json({ message: "Email or password does not match!" });
    if ((0, encryption_1.Decrypt)(userWithEmail.password, Buffer.from(encrypt_key), Buffer.from(iv_key)) !== password)
        return res
            .status(400)
            .json({ message: "Password does not match!" });
    // Check if the user is already logged in (has an active session)
    // Query the database to check for the existence of a session record for the user
    index_1.SessionStore.all((error, sessions) => {
        if (error) {
            console.error('Error querying sessions:', error);
            res.status(500).send('Error checking session');
        }
        else {
            for (let sessionID in sessions) { // get session id
                if (sessionID != req.sessionID) { // get session id that is in other device
                    if (userWithEmail.username == sessions[sessionID]['user']['username']) { // username match
                        const sessionDate = new Date(sessions[sessionID]['user']['date']);
                        const currentSessDate = new Date(req.session.user?.date);
                        if (currentSessDate > sessionDate) { // current session date is newer
                            index_1.SessionStore.destroy(sessionID, (err) => {
                                if (error) {
                                    console.error('Error destroying previous session:', error);
                                    return res
                                        .status(400)
                                        .json({ message: 'Error destroying previous session:', error });
                                }
                            });
                        }
                    }
                }
            }
        }
    });
    // Check user credentials, then store user data in the session
    index_1.UserSessions[userWithEmail.username] = req.sessionID; // user session tracker
    req.session.user = {
        username: userWithEmail.username,
        lastLogin: req.sessionID,
        date: new Date()
    };
    // Create a JWT token and send it as a response
    // const token = jwt.sign({
    //   first_name: userWithEmail.first_name,
    //   last_name: userWithEmail.last_name,
    //   date_of_birth: userWithEmail.date_of_birth,
    //   address: userWithEmail.address,
    //   city: userWithEmail.city,
    //   province: userWithEmail.province,
    //   country: userWithEmail.country,
    //   phone_number: userWithEmail.phone_number,
    //   email: userWithEmail.email,
    //   username: userWithEmail.username,
    //   created_at: userWithEmail.created_at,
    //   modify_at: userWithEmail.modify_at
    // }, secretKey, { expiresIn: '1h' });
    res.json({ message: "Welcome Back!", user_data: userWithEmail });
    // res.json({ message: "Welcome Back!", token: token, user_data: userWithEmail });
};
exports.LoginUser = LoginUser;
