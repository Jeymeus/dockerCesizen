import express from 'express';
import { register, login, resetPassword, publicResetPassword, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/reset-password', authenticateToken, resetPassword);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', publicResetPassword)


export default router;
