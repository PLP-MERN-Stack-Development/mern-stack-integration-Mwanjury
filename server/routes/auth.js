import express from 'express';
import { body } from 'express-validator';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password at least 6 chars'),
  authController.register
);

router.post('/login', authController.login);

router.get('/me', protect, authController.me);

export default router;
