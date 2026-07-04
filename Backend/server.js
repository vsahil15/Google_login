import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import session from 'express-session';
import { connectDB } from './config/db.js';
import authLoginRoutes from './routes/authLogin.routes.js';
import authRegisterRoutes from './routes/authRegister.routes.js';
import passport from './config/passport.js';

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://google-login-xi.vercel.app/',
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []),
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));

server.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: false,
}));

server.use(passport.initialize());
server.use(passport.session());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is running successfully.' });
});

server.use('/api/v1/auth', authLoginRoutes);
server.use('/api/v1/auth', authRegisterRoutes);

server.get('/api/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
server.get(
  '/api/v1/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://google-login-xi.vercel.app/login' }),
  (req, res) => {
    const email = req.user?.email || 'your account';
    const redirectUrl = `https://google-login-xi.vercel.app/welcome?google=success&email=${encodeURIComponent(email)}`;
    res.redirect(redirectUrl);
  }
);

server.post('/api/v1/auth/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed.' });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return res.status(500).json({ message: 'Session cleanup failed.' });
      }

      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

startServer();

export default server;

