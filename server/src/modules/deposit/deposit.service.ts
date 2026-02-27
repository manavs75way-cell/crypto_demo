import { Wallet } from '../wallet/wallet.model';
import { Transaction } from '../../models/transaction.model';
import { SupportedCurrency } from '../wallet/wallet.model';

export const simulateDepositService = async (
    userId: string,
    currency: SupportedCurrency,
    amount: number
) => {
    let wallet = await Wallet.findOne({ userId, currency });
    if (!wallet) {
        throw Object.assign(new Error(`No ${currency} wallet found. Create one first.`), { statusCode: 404 });
    }

    wallet.balance = parseFloat((wallet.balance + amount).toFixed(8));
    await wallet.save();

    const tx = await Transaction.create({
        userId,
        type: 'DEPOSIT',
        currency,
        amount,
        status: 'COMPLETED',
        note: `Simulated deposit of ${amount} ${currency}`,
    });

    return { wallet, transaction: tx };
};

export const getDepositHistoryService = async (userId: string) => {
    return Transaction.find({ userId, type: 'DEPOSIT' }).sort({ createdAt: -1 });
};
