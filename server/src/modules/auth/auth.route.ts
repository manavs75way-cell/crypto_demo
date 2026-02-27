import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
