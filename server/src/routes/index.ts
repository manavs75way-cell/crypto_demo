import { Router } from 'express';
import authRouter from '../modules/auth/auth.route';
import kycRouter from '../modules/kyc/kyc.route';
import walletRouter from '../modules/wallet/wallet.route';
import depositRouter from '../modules/deposit/deposit.route';
import tradeRouter from '../modules/trade/trade.route';
import withdrawRouter from '../modules/withdraw/withdraw.route';
import adminRouter from '../modules/admin/admin.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/kyc', kycRouter);
router.use('/wallet', walletRouter);
router.use('/deposit', depositRouter);
router.use('/trade', tradeRouter);
router.use('/withdraw', withdrawRouter);
router.use('/admin', adminRouter);

export default router;
