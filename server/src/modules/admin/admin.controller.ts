import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { reviewKycService, getAllPendingKycService } from '../kyc/kyc.service';
import { Transaction } from '../../models/transaction.model';
import { User } from '../auth/user.model';
import { Kyc } from '../kyc/kyc.model';

export const getPendingKyc = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const applications = await getAllPendingKycService();
        res.json({ success: true, applications });
    } catch (err) { next(err); }
};

export const reviewKyc = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { action, reason } = req.body as { action: 'APPROVED' | 'REJECTED'; reason?: string };
        const validAction: 'APPROVED' | 'REJECTED' = action === 'REJECTED' ? 'REJECTED' : 'APPROVED';
        const kyc = await reviewKycService(String(req.params.id), validAction, reason);
        res.json({ success: true, kyc });
    } catch (err) { next(err); }
};

export const getAllTrades = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(String(req.query.page) || '1', 10);
        const limit = parseInt(String(req.query.limit) || '20', 10);
        const skip = (page - 1) * limit;

        const [trades, total] = await Promise.all([
            Transaction.find().populate('userId', 'email firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
            Transaction.countDocuments(),
        ]);
        res.json({ success: true, trades, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

export const getAllUsers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find().select('-passwordHash -refreshTokens').sort({ createdAt: -1 });

        // Attach KYC status to each user
        const userIds = users.map((u) => u._id);
        const kycs = await Kyc.find({ userId: { $in: userIds } }).select('userId status');
        const kycMap = new Map(kycs.map((k) => [k.userId.toString(), k.status]));

        const usersWithKyc = users.map((u) => ({
            _id: u._id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            kycStatus: kycMap.get(u._id.toString()) || 'NOT_SUBMITTED',
            createdAt: (u as unknown as { createdAt: Date }).createdAt,
        }));

        res.json({ success: true, users: usersWithKyc });
    } catch (err) { next(err); }
};
