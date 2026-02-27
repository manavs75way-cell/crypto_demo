import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { submitKycService, getKycStatusService } from './kyc.service';

export const submitKyc = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const kyc = await submitKycService(req.userId!, req.body);
        res.status(201).json({ success: true, kyc });
    } catch (err) { next(err); }
};

export const getKycStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const kyc = await getKycStatusService(req.userId!);
        res.json({ success: true, kyc });
    } catch (err) { next(err); }
};

