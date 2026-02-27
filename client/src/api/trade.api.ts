import api from './axios';
import { Transaction, PriceMap, SupportedCurrency } from '../types';

export const tradeApi = {
    getPrices: () => api.get<{ success: boolean; prices: PriceMap }>('/trade/prices'),

    execute: (fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency, amount: number) =>
        api.post<{ success: boolean; transaction: Transaction }>('/trade/execute', {
            fromCurrency,
            toCurrency,
            amount,
        }),

    history: () => api.get<{ success: boolean; transactions: Transaction[] }>('/trade/history'),
};
