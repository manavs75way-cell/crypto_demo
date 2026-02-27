import mongoose, { Document, Schema } from 'mongoose';

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type IdType = 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';

export interface IKyc extends Document {
    userId: mongoose.Types.ObjectId;
    fullName: string;
    dob: string;
    nationality: string;
    idType: IdType;
    idNumber: string;
    address: string;
    status: KycStatus;
    rejectionReason?: string;
    reviewedAt?: Date;
}

const KycSchema = new Schema<IKyc>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        fullName: { type: String, required: true },
        dob: { type: String, required: true },
        nationality: { type: String, required: true },
        idType: { type: String, enum: ['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE'], required: true },
        idNumber: { type: String, required: true },
        address: { type: String, required: true },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
        rejectionReason: { type: String },
        reviewedAt: { type: Date },
    },
    { timestamps: true }
);

export const Kyc = mongoose.model<IKyc>('Kyc', KycSchema);
