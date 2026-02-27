import { Wallet, SupportedCurrency } from '../wallet/wallet.model';
import { Transaction } from '../../models/transaction.model';
import { WithdrawInput } from './withdraw.schema';

const WITHDRAW_FEE_RATE = 0.002; 

export const requestWithdrawService = async (userId: string, data: WithdrawInput) => {
    const { currency, amount, toAddress } = data;
    const c = currency as SupportedCurrency;

    const wallet = await Wallet.findOne({ userId, currency: c });
    if (!wallet) throw Object.assign(new Error(`No ${c} wallet found`), { statusCode: 404 });

    const fee = parseFloat((amount * WITHDRAW_FEE_RATE).toFixed(8));
    const total = parseFloat((amount + fee).toFixed(8));

    if (wallet.balance < total)
        throw Object.assign(new Error(`Insufficient balance. Need ${total} ${c} (including fee)`), { statusCode: 400 });

    wallet.balance = parseFloat((wallet.balance - total).toFixed(8));
    await wallet.save();

    const tx = await Transaction.create({
        userId,
        type: 'WITHDRAW',
        currency: c,
        amount,
        fee,
        status: 'COMPLETED',
        note: `Withdrawal of ${amount} ${c} to ${toAddress}`,
    });

    return { wallet, transaction: tx };
};

export const getWithdrawHistoryService = async (userId: string) => {
    return Transaction.find({ userId, type: 'WITHDRAW' }).sort({ createdAt: -1 });
};
