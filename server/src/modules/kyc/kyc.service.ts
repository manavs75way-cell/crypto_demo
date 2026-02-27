import { Kyc } from './kyc.model';
import { KycInput } from './kyc.schema';

export const submitKycService = async (userId: string, data: KycInput) => {
    const existing = await Kyc.findOne({ userId });
    if (existing) {
        if (existing.status === 'APPROVED') throw Object.assign(new Error('KYC already approved'), { statusCode: 400 });
        if (existing.status === 'PENDING') throw Object.assign(new Error('KYC already submitted and pending review'), { statusCode: 400 });
        // REJECTED → re-submission: update fields, reset to PENDING, clear rejection reason
        Object.assign(existing, { ...data, status: 'PENDING', rejectionReason: undefined, reviewedAt: undefined });
        return existing.save();
    }
    return Kyc.create({ userId, ...data });
};

export const getKycStatusService = async (userId: string) => {
    const kyc = await Kyc.findOne({ userId });
    if (!kyc) return null;
    return kyc;
};

export const reviewKycService = async (kycId: string, action: 'APPROVED' | 'REJECTED', reason?: string) => {
    const updateData: Record<string, unknown> = { status: action, reviewedAt: new Date() };
    if (action === 'REJECTED' && reason) {
        updateData.rejectionReason = reason;
    } else {
        updateData.rejectionReason = undefined;
    }
    const kyc = await Kyc.findByIdAndUpdate(kycId, updateData, { new: true });
    if (!kyc) throw Object.assign(new Error('KYC record not found'), { statusCode: 404 });
    return kyc;
};

export const getAllPendingKycService = async () => {
    return Kyc.find({ status: 'PENDING' }).populate('userId', 'email firstName lastName').sort({ createdAt: -1 });
};

