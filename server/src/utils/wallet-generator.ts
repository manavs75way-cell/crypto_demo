import crypto from 'crypto';
import { SupportedCurrency } from '../modules/wallet/wallet.model';

const PREFIX_MAP: Record<SupportedCurrency, string> = {
    BTC: '1',
    ETH: '0x',
    USDT: '0x',
    BNB: 'bnb',
    SOL: '',
    XRP: 'r',
};

export const generateWalletAddress = (currency: SupportedCurrency): string => {
    const random = crypto.randomBytes(20).toString('hex');
    return `${PREFIX_MAP[currency]}${random}`;
};
