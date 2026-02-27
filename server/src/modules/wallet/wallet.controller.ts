import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getWalletsService, createWalletService, getWalletAddressService } from './wallet.service';
import { SupportedCurrency } from './wallet.model';

export const getWallets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const wallets = await getWalletsService(req.userId!);
        res.json({ success: true, wallets });
    } catch (err) { next(err); }
};

export const createWallet = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currency } = req.body as { currency: SupportedCurrency };
        const wallet = await createWalletService(req.userId!, currency);
        res.status(201).json({ success: true, wallet });
    } catch (err) { next(err); }
};

export const getWalletAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const currency = req.params.currency as SupportedCurrency;
        const wallet = await getWalletAddressService(req.userId!, currency);
        res.json({ success: true, wallet });
    } catch (err) { next(err); }
};
