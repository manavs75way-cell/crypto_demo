import { Router } from 'express';
import { getPrices, trade, getTradeHistory } from './trade.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tradeSchema } from './trade.schema';

const router = Router();

router.get('/prices', getPrices);
router.post('/execute', authMiddleware, validate(tradeSchema), trade);
router.get('/history', authMiddleware, getTradeHistory);

export default router;
