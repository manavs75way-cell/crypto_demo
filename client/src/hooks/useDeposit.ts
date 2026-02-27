import { useState, useCallback } from 'react';
import { depositApi } from '../api/deposit.api';
import { Transaction, SupportedCurrency } from '../types';

export const useDeposit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<Transaction[]>([]);

    const simulateDeposit = useCallback(async (currency: SupportedCurrency, amount: number) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await depositApi.simulate(currency, amount);
            return data;
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Deposit failed';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchHistory = useCallback(async () => {
        const { data } = await depositApi.history();
        setHistory(data.transactions);
    }, []);

    return { simulateDeposit, loading, error, history, fetchHistory };
};
