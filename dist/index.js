"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = exports.Options = exports.MySQLStore = exports.UserSessions = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const createUserRoutes_1 = __importDefault(require("./routes/createUserRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const loginRouter_1 = __importDefault(require("./routes/loginRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 3000;
exports.UserSessions = {}; // track if user login in another device
dotenv_1.default.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });
// Set up the MySQL session store
exports.MySQLStore = require('express-mysql-session')(express_session_1.default);
exports.Options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
exports.SessionStore = new exports.MySQLStore(exports.Options);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    store: exports.SessionStore,
}));
// Middleware to check and manage sessions
app.use((req, res, next) => {
    if (!req.session.user) {
        // User is not logged in; allow access
        next();
    }
    else if (req.session.user.lastLogin === req.sessionID) {
        // This session is the newest login; allow access
        next();
    }
    else {
        // Invalidate other sessions
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error destroying old in index session');
            }
            else {
                res.send('Previous session destroyed');
            }
        });
    }
});
// Define a simple home route
app.get('/', (req, res) => {
    res.send('Welcome to the API. session id : ' + req.sessionID);
});
// Use the routers for their respective paths
app.use('/users', createUserRoutes_1.default);
app.use('/login', loginRouter_1.default);
app.use('/wallets', walletRoutes_1.default);
app.post('/logout', (req, res) => {
    // Destroy the session to log the user out
    // delete userSessions[req.session.user?.username];
    exports.SessionStore.destroy(req.sessionID, (error) => {
        if (error) {
            console.error('Error destroying previous session:', error);
            // Handle the error as needed
            return res
                .status(400)
                .json({ message: 'Error destroying previous session:', error });
        }
        // Proceed with the login for the current device
        res.status(200).send('Logout successful');
    });
});
app.get('/check-session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    // Use the session store's "get" method to retrieve the session by ID
    exports.SessionStore.get(sessionId, (error, sessionData) => {
        if (error) {
            console.error('Error retrieving session:', error);
            res.status(500).send('Error checking session');
        }
        else if (sessionData === null) {
            // The session with the given ID does not exist
            res.status(404).send('Session not found');
        }
        else {
            // The session with the given ID exists
            res.status(200).send('Session found');
        }
    });
});
app.get('/destroy-session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    exports.SessionStore.destroy(sessionId, (error) => {
        if (error) {
            console.error('Error destroying previous session:', error);
            // Handle the error as needed
            return res
                .status(400)
                .json({ message: 'Error destroying previous session:', error });
        }
        // Proceed with the login for the current device
        res.status(200).send('Session destroyed');
    });
});
app.get('/check-session', (req, res) => {
    const username = 'user';
    // Query the database to check for the existence of a session record for the user
    exports.SessionStore.all((error, sessions) => {
        if (error) {
            console.error('Error querying sessions:', error);
            res.status(500).send('Error checking session');
        }
        else {
            let sessionExists = false;
            let sessionID;
            for (sessionID in sessions) {
                if ('user' == sessions[sessionID]['user']['username'])
                    sessionExists = true;
            }
            if (sessionExists) {
                res.send('Session exists for the user');
            }
            else {
                res.send('Session does not exist for the user');
            }
        }
    });
});
// catch other routes as error
app.get('*', (_, res) => {
    res.status(404).send('Error: Page not found');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
