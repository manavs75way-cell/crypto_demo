import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import { getPendingKyc, reviewKyc, getAllTrades, getAllUsers } from './admin.controller';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/kyc/pending', getPendingKyc);
router.patch('/kyc/:id/review', reviewKyc);
router.get('/trades', getAllTrades);
router.get('/users', getAllUsers);

export default router;
