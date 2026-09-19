import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);

export default router;
