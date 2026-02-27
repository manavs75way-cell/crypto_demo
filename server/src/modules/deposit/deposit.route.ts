import { Router } from 'express';
import { simulateDeposit, getDepositHistory } from './deposit.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.post('/simulate', authMiddleware, simulateDeposit);
router.get('/history', authMiddleware, getDepositHistory);

export default router;
