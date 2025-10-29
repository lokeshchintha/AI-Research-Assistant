import express from 'express';
import { register, login, getMe, verifyRegisterOTP, verifyLoginOTP, resendOTP } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOTP);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

export default router;
