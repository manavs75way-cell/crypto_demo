import { useState } from 'react';
import { useWallets } from '../../hooks/useWallets';
import { usePrices } from '../../hooks/usePrices';
import { useTrade } from '../../hooks/useTrade';
import { SupportedCurrency } from '../../types';

export const TradePage = () => {
    const { wallets, refetch } = useWallets();
    const { prices } = usePrices();
    const { executeTrade, loading, error, success } = useTrade();

    const [from, setFrom] = useState<SupportedCurrency>('BTC');
    const [to, setTo] = useState<SupportedCurrency>('ETH');
    const [amount, setAmount] = useState('');

    const CURRENCIES: SupportedCurrency[] = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP'];

    const fromBalance = wallets.find((w) => w.currency === from)?.balance ?? 0;
    const fromPrice = prices[from] ?? 0;
    const toPrice = prices[to] ?? 0;
    const amtNum = parseFloat(amount) || 0;

    const estimatedOut =
        toPrice > 0 ? (amtNum * fromPrice * 0.999) / toPrice : 0;

    const handleTrade = async () => {
        if (!amtNum || from === to || amtNum > fromBalance) return;
        await executeTrade(from, to, amtNum);
        setAmount('');
        refetch();
    };

    const handleFlip = () => {
        setFrom(to);
        setTo(from);
        setAmount('');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Trade Crypto
                </h1>
                <p className="text-slate-400 mb-8">
                    Swap between cryptocurrencies instantly. Market order, 0.1% fee.
                </p>

                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6 space-y-6">

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            From
                        </label>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all duration-200">
                            <div className="flex justify-between items-center mb-2">
                                <select
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value as SupportedCurrency)}
                                    className="bg-transparent text-white font-semibold focus:outline-none"
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c} value={c} className="bg-slate-900">
                                            {c}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setAmount(fromBalance.toString())}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                                >
                                    Max
                                </button>
                            </div>

                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-transparent text-white text-lg font-semibold focus:outline-none placeholder:text-slate-500"
                            />
                        </div>

                        <p className="text-slate-500 text-xs mt-2">
                            Available:{' '}
                            <span className="text-slate-300 font-medium">
                                {fromBalance.toFixed(6)} {from}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            onClick={handleFlip}
                            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center justify-center text-slate-400 hover:text-white"
                        >
                            ⇅
                        </button>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            To
                        </label>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                            <div className="flex justify-between items-center">
                                <select
                                    value={to}
                                    onChange={(e) => setTo(e.target.value as SupportedCurrency)}
                                    className="bg-transparent text-white font-semibold focus:outline-none"
                                >
                                    {CURRENCIES.filter((c) => c !== from).map((c) => (
                                        <option key={c} value={c} className="bg-slate-900">
                                            {c}
                                        </option>
                                    ))}
                                </select>

                                <span className="text-emerald-400 font-bold text-base font-mono">
                                    {estimatedOut > 0
                                        ? `≈ ${estimatedOut.toFixed(6)}`
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-500 text-xs mt-2">
                            Rate: 1 {from} ≈{' '}
                            {toPrice > 0
                                ? (fromPrice / toPrice).toFixed(6)
                                : '—'}{' '}
                            {to}
                        </p>
                    </div>

                    {amtNum > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm space-y-2">
                            <div className="flex justify-between text-slate-300">
                                <span>Fee (0.1%)</span>
                                <span className="text-white">
                                    {(amtNum * 0.001).toFixed(6)} {from}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>You receive</span>
                                <span className="text-emerald-400 font-bold text-base">
                                    {estimatedOut.toFixed(6)} {to}
                                </span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
                            {success}
                        </div>
                    )}

                    <button
                        onClick={handleTrade}
                        disabled={
                            loading ||
                            !amtNum ||
                            from === to ||
                            amtNum > fromBalance
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? 'Executing Trade…'
                            : `Swap ${from} → ${to}`}
                    </button>
                </div>
            </div>
        </div>
    );
};