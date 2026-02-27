import api from './axios';
import { Transaction, SupportedCurrency } from '../types';

export const withdrawApi = {
    request: (currency: SupportedCurrency, amount: number, toAddress: string) =>
        api.post<{ success: boolean; transaction: Transaction }>('/withdraw/request', {
            currency,
            amount,
            toAddress,
        }),

    history: () => api.get<{ success: boolean; transactions: Transaction[] }>('/withdraw/history'),
};
