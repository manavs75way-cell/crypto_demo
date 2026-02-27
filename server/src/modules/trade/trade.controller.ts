import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { executeTrade, getTradeHistoryService, getPricesService } from './trade.service';

export const getPrices = (_req: Request, res: Response, next: NextFunction): void => {
    try {
        const prices = getPricesService();
        res.json({ success: true, prices });
    } catch (err) { next(err); }
};

export const trade = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await executeTrade(req.userId!, req.body);
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
};

export const getTradeHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const transactions = await getTradeHistoryService(req.userId!);
        res.json({ success: true, transactions });
    } catch (err) { next(err); }
};
