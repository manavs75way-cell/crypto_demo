import { Router } from 'express';
import { requestWithdraw, getWithdrawHistory } from './withdraw.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { withdrawSchema } from './withdraw.schema';

const router = Router();

router.post('/request', authMiddleware, validate(withdrawSchema), requestWithdraw);
router.get('/history', authMiddleware, getWithdrawHistory);

export default router;
