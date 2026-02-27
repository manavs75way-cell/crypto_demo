import { Wallet, SupportedCurrency } from '../wallet/wallet.model';
import { Transaction } from '../../models/transaction.model';
import { getPrice, getPrices } from '../../utils/crypto-prices';
import { TradeInput } from './trade.schema';
import { generateWalletAddress } from '../../utils/wallet-generator';

const FEE_RATE = 0.001; // 0.1%

export const executeTrade = async (userId: string, data: TradeInput) => {
    const { fromCurrency, toCurrency, amount } = data;
    const fromC = fromCurrency as SupportedCurrency;
    const toC = toCurrency as SupportedCurrency;

    const fromWallet = await Wallet.findOne({ userId, currency: fromC });
    if (!fromWallet) throw Object.assign(new Error(`No ${fromC} wallet found`), { statusCode: 404 });
    if (fromWallet.balance < amount)
        throw Object.assign(new Error(`Insufficient ${fromC} balance`), { statusCode: 400 });

    const fromPrice = getPrice(fromC);
    const toPrice = getPrice(toC);
    const usdValue = amount * fromPrice;
    const fee = usdValue * FEE_RATE;
    const toAmount = parseFloat(((usdValue - fee) / toPrice).toFixed(8));

    let toWallet = await Wallet.findOne({ userId, currency: toC });
    if (!toWallet) {
        toWallet = await Wallet.create({
            userId,
            currency: toC,
            address: generateWalletAddress(toC),
            balance: 0,
        });
    }

    fromWallet.balance = parseFloat((fromWallet.balance - amount).toFixed(8));
    toWallet.balance = parseFloat((toWallet.balance + toAmount).toFixed(8));
    await fromWallet.save();
    await toWallet.save();

    const tx = await Transaction.create({
        userId,
        type: 'TRADE',
        currency: fromC,
        fromCurrency: fromC,
        toCurrency: toC,
        amount,
        toAmount,
        fee: parseFloat((fee / fromPrice).toFixed(8)),
        status: 'COMPLETED',
        note: `Swapped ${amount} ${fromC} → ${toAmount} ${toC}`,
    });

    return { fromWallet, toWallet, transaction: tx };
};

export const getTradeHistoryService = async (userId: string) => {
    return Transaction.find({ userId, type: 'TRADE' }).sort({ createdAt: -1 });
};

export const getPricesService = () => getPrices();
