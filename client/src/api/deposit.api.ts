import api from './axios';
import { Transaction, SupportedCurrency } from '../types';

export const depositApi = {
    simulate: (currency: SupportedCurrency, amount: number) =>
        api.post<{ success: boolean; transaction: Transaction }>('/deposit/simulate', { currency, amount }),

    history: () => api.get<{ success: boolean; transactions: Transaction[] }>('/deposit/history'),
};
