import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallets } from '../../hooks/useWallets';
import { usePrices } from '../../hooks/usePrices';
import { SupportedCurrency } from '../../types';

const COIN_ICONS: Record<SupportedCurrency, string> = {
    BTC: '₿', ETH: 'Ξ', USDT: '$', BNB: 'BNB', SOL: '◎', XRP: 'X',
};
const COIN_COLORS: Record<SupportedCurrency, string> = {
    BTC: 'from-orange-500 to-yellow-400',
    ETH: 'from-indigo-500 to-purple-400',
    USDT: 'from-emerald-500 to-teal-400',
    BNB: 'from-yellow-500 to-orange-400',
    SOL: 'from-purple-500 to-pink-400',
    XRP: 'from-sky-500 to-blue-400',
};

export const DashboardPage = () => {
    const { user } = useAuth();
    const { wallets, loading: loadingWallets, createWallet } = useWallets();
    const { prices, loading: loadingPrices, supported } = usePrices();

    useEffect(() => {
        supported.forEach((c) => {
            const has = wallets.some((w) => w.currency === c);
            if (!has) createWallet(c as SupportedCurrency).catch(() => null);
        });
    }, [wallets.length]);

    const totalUsd = wallets.reduce((sum, w) => {
        const price = prices[w.currency as SupportedCurrency] ?? 0;
        return sum + w.balance * price;
    }, 0);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-slate-400 mt-1">Here's your portfolio overview</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl p-6 shadow-xl shadow-indigo-500/20">
                <p className="text-indigo-100 text-sm font-medium mb-1">Total Portfolio Value</p>
                <p className="text-white text-4xl font-bold">${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-indigo-200 text-sm mt-2">{wallets.length} active {wallets.length === 1 ? 'wallet' : 'wallets'}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Your Wallets</h2>
                {loadingWallets ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-slate-800 rounded-2xl h-28 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {supported.map((c) => {
                            const wallet = wallets.find((w) => w.currency === c);
                            const balance = wallet?.balance ?? 0;
                            const price = prices[c as SupportedCurrency] ?? 0;
                            const usdVal = balance * price;
                            return (
                                <div key={c} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COIN_COLORS[c as SupportedCurrency]} flex items-center justify-center text-white font-bold text-sm`}>
                                            {COIN_ICONS[c as SupportedCurrency]}
                                        </div>
                                        <span className="text-slate-400 text-xs font-medium bg-slate-800 px-2 py-1 rounded-lg">{c}</span>
                                    </div>
                                    <p className="text-white text-xl font-bold">{balance.toFixed(6)}</p>
                                    <p className="text-slate-400 text-sm mt-1">≈ ${usdVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Live Prices</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loadingPrices ? (
                        <div className="py-8 flex items-center justify-center">
                            <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Asset</th>
                                    <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Price (USD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supported.map((c) => (
                                    <tr key={c} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COIN_COLORS[c as SupportedCurrency]} flex items-center justify-center text-white font-bold text-xs`}>
                                                    {COIN_ICONS[c as SupportedCurrency]}
                                                </div>
                                                <span className="text-white font-medium">{c}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-white font-mono font-medium">
                                            ${(prices[c as SupportedCurrency] ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
