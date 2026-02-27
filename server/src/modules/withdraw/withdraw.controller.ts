import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { requestWithdrawService, getWithdrawHistoryService } from './withdraw.service';

export const requestWithdraw = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await requestWithdrawService(req.userId!, req.body);
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getWithdrawHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const transactions = await getWithdrawHistoryService(req.userId!);
        res.json({ success: true, transactions });
    } catch (err) { next(err); }
};
