import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { simulateDepositService, getDepositHistoryService } from './deposit.service';
import { SupportedCurrency } from '../wallet/wallet.model';

export const simulateDeposit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currency, amount } = req.body as { currency: SupportedCurrency; amount: number };
        const result = await simulateDepositService(req.userId!, currency, amount);
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getDepositHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const transactions = await getDepositHistoryService(req.userId!);
        res.json({ success: true, transactions });
    } catch (err) { next(err); }
};
