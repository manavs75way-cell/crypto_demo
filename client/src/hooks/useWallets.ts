import { useState, useEffect, useCallback } from 'react';
import { walletApi } from '../api/wallet.api';
import { Wallet, SupportedCurrency } from '../types';

export const useWallets = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWallets = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await walletApi.getAll();
            setWallets(data.wallets);
        } catch {
            setError('Failed to load wallets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchWallets(); }, [fetchWallets]);

    const createWallet = async (currency: SupportedCurrency) => {
        const { data } = await walletApi.create(currency);
        setWallets((prev) => [...prev, data.wallet]);
        return data.wallet;
    };

    const getBalance = (currency: SupportedCurrency): number =>
        wallets.find((w) => w.currency === currency)?.balance ?? 0;

    return { wallets, loading, error, refetch: fetchWallets, createWallet, getBalance };
};
