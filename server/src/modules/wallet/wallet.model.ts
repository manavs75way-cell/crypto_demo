import mongoose, { Document, Schema } from 'mongoose';

export type SupportedCurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP';

export interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    currency: SupportedCurrency;
    address: string;
    balance: number;
}

const WalletSchema = new Schema<IWallet>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        currency: {
            type: String,
            enum: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'],
            required: true,
        },
        address: { type: String, required: true, unique: true },
        balance: { type: Number, default: 0 },
    },
    { timestamps: true }
);

WalletSchema.index({ userId: 1, currency: 1 }, { unique: true });

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
