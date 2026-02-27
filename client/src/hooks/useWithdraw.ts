import { useState, useCallback } from 'react';
import { withdrawApi } from '../api/withdraw.api';
import { SupportedCurrency } from '../types';

export const useWithdraw = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const requestWithdraw = useCallback(
        async (currency: SupportedCurrency, amount: number, toAddress: string) => {
            setLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const { data } = await withdrawApi.request(currency, amount, toAddress);
                setSuccess(`Withdrawal of ${amount} ${currency} submitted successfully`);
                return data;
            } catch (err: unknown) {
                const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Withdrawal failed';
                setError(msg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { requestWithdraw, loading, error, success };
};
