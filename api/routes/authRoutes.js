import express from 'express';
import { register, login, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/reset-password', authenticate, resetPassword);

export default router;
