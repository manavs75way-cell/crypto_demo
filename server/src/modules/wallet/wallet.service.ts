import { Wallet } from './wallet.model';
import { SupportedCurrency } from './wallet.model';
import { generateWalletAddress } from '../../utils/wallet-generator';

export const getWalletsService = async (userId: string) => {
    return Wallet.find({ userId });
};

export const createWalletService = async (userId: string, currency: SupportedCurrency) => {
    const existing = await Wallet.findOne({ userId, currency });
    if (existing) throw Object.assign(new Error(`Wallet for ${currency} already exists`), { statusCode: 409 });
    const address = generateWalletAddress(currency);
    return Wallet.create({ userId, currency, address });
};

export const getWalletAddressService = async (userId: string, currency: SupportedCurrency) => {
    let wallet = await Wallet.findOne({ userId, currency });
    if (!wallet) {
        const address = generateWalletAddress(currency);
        wallet = await Wallet.create({ userId, currency, address });
    }
    return wallet;
};
