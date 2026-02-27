import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'DEPOSIT' | 'TRADE' | 'WITHDRAW';
export type TxStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: TransactionType;
    currency: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount: number;
    toAmount?: number;
    fee: number;
    status: TxStatus;
    note?: string;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['DEPOSIT', 'TRADE', 'WITHDRAW'], required: true },
        currency: { type: String, required: true },
        fromCurrency: { type: String },
        toCurrency: { type: String },
        amount: { type: Number, required: true },
        toAmount: { type: Number },
        fee: { type: Number, default: 0 },
        status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
        note: { type: String },
    },
    { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
