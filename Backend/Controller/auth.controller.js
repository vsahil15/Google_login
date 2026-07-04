import { validationResult } from 'express-validator';
import User from '../models/users.js';

const buildUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  authProvider: user.authProvider || 'local',
});

export const postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({
      message: 'Registration successful.',
      user: buildUserResponse(newUser),
    });
  } catch (error) {
    console.error('postRegister error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error('postLogin error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
