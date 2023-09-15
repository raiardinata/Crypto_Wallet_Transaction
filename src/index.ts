import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/createUserRoutes';
import walletRoutes from './routes/walletRoutes';
import loginRoutes from './routes/loginRouter';
import dotenv from 'dotenv'

const app = express();
const port = 3000;
export const UserSessions: Record<string, string> = {}; // track if user login in another device

dotenv.config({ path: '/home/raiardinata/ra_Server/typescript/playground/SW_Test/.env' });

// Set up the MySQL session store
export let MySQLStore = require('express-mysql-session')(session);
export const Options = {
  host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
export let SessionStore = new MySQLStore(Options);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.COOKIE_KEY!,
    resave: false,
    saveUninitialized: true,
    store: SessionStore,
  })
);

// add user into session data interface
declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

// Middleware to check and manage sessions
app.use((req, res, next) => {
  if (!req.session.user) {
    // User is not logged in; allow access
    next();
  } else if (req.session.user.lastLogin === req.sessionID) {
    // This session is the newest login; allow access
    next();
  } else {
    // Invalidate other sessions
    req.session.destroy( (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error destroying old in index session');
      } else {
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
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/wallets', walletRoutes);
app.use('/check-wallets', walletRoutes);

app.post('/logout', (req, res) => {
  // Destroy the session to log the user out
  // delete userSessions[req.session.user?.username];
  SessionStore.destroy(req.sessionID, (error: any) => {
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
  SessionStore.get(sessionId, (error: any, sessionData: any) => {
    if (error) {
      console.error('Error retrieving session:', error);
      res.status(500).send('Error checking session');
    } else if (sessionData === null) {
      // The session with the given ID does not exist
      res.status(404).send('Session not found');
    } else {
      // The session with the given ID exists
      res.status(200).send('Session found');
    }
  });
});

app.get('/destroy-session/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;

  SessionStore.destroy(sessionId, (error: any) => {
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
  SessionStore.all((error: any, sessions: any) => {
    if (error) {
      console.error('Error querying sessions:', error);
      res.status(500).send('Error checking session');
    } else {
      let sessionExists = false;
      let sessionID: any;
      for (sessionID in sessions) {
        if ('user' == sessions[sessionID]['user']['username'])
          sessionExists = true;
      }
      if (sessionExists) {
        res.send('Session exists for the user');
      } else {
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
