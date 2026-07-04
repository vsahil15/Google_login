import express from 'express';
import { body } from 'express-validator';
import * as authController from '../Controller/auth.controller.js';

const router = express.Router();

router.post(
  '/login',
  body('email').trim().isEmail().isLength({ min: 5 }),
  body('password').trim().isLength({ min: 5 }),
  authController.postLogin
);

export default router;