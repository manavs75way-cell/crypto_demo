import { Router } from 'express';
import { getWallets, createWallet, getWalletAddress } from './wallet.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getWallets);
router.post('/create', authMiddleware, createWallet);
router.get('/address/:currency', authMiddleware, getWalletAddress);

export default router;
