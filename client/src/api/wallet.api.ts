import api from './axios';
import { Wallet, SupportedCurrency } from '../types';

export const walletApi = {
    getAll: () => api.get<{ success: boolean; wallets: Wallet[] }>('/wallet'),

    create: (currency: SupportedCurrency) =>
        api.post<{ success: boolean; wallet: Wallet }>('/wallet/create', { currency }),

    getAddress: (currency: SupportedCurrency) =>
        api.get<{ success: boolean; wallet: Wallet }>(`/wallet/address/${currency}`),
};
