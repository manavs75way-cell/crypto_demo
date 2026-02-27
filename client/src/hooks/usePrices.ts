import { useState, useEffect, useCallback } from 'react';
import { tradeApi } from '../api/trade.api';
import { PriceMap } from '../types';

const SUPPORTED: (keyof PriceMap)[] = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'];

const defaultPrices: PriceMap = { BTC: 0, ETH: 0, USDT: 1, BNB: 0, SOL: 0, XRP: 0 };

export const usePrices = () => {
    const [prices, setPrices] = useState<PriceMap>(defaultPrices);
    const [loading, setLoading] = useState(true);

    const fetchPrices = useCallback(async () => {
        try {
            const { data } = await tradeApi.getPrices();
            setPrices(data.prices);
        } catch { 
            setPrices(defaultPrices);
         }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 5000);
        return () => clearInterval(interval);
    }, [fetchPrices]);

    return { prices, loading, supported: SUPPORTED };
};
