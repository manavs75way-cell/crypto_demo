import { SupportedCurrency } from '../modules/wallet/wallet.model';

type PriceMap = Record<SupportedCurrency, number>;

const BASE_PRICES: PriceMap = {
    BTC: 65000,
    ETH: 3200,
    USDT: 1,
    BNB: 580,
    SOL: 145,
    XRP: 0.55,
};

let currentPrices: PriceMap = { ...BASE_PRICES };

const drift = (): void => {
    const keys = Object.keys(currentPrices) as SupportedCurrency[];
    keys.forEach((key) => {
        if (key === 'USDT') return; 
        const change = 1 + (Math.random() - 0.5) * 0.01; 
        currentPrices[key] = parseFloat((currentPrices[key] * change).toFixed(6));
    });
};

export const startPriceFeed = (): NodeJS.Timeout => setInterval(drift, 5000);
export const getPrices = (): PriceMap => ({ ...currentPrices });
export const getPrice = (currency: SupportedCurrency): number => currentPrices[currency];
