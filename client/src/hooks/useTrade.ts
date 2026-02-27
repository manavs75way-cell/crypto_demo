import { useState, useCallback } from 'react';
import { tradeApi } from '../api/trade.api';
import { SupportedCurrency } from '../types';

export const useTrade = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const executeTrade = useCallback(
        async (from: SupportedCurrency, to: SupportedCurrency, amount: number) => {
            setLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const { data } = await tradeApi.execute(from, to, amount);
                setSuccess(`Successfully swapped ${amount} ${from} → ${data.transaction.toAmount} ${to}`);
                return data;
            } catch (err: unknown) {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Trade failed';
                setError(msg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { executeTrade, loading, error, success };
};
