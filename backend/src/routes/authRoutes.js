import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/change-password', protect, changePassword);

export default router;
