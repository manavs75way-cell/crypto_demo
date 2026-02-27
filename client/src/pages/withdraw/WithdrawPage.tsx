import { useState } from 'react';
import { useWallets } from '../../hooks/useWallets';
import { useWithdraw } from '../../hooks/useWithdraw';
import { SupportedCurrency } from '../../types';

export const WithdrawPage = () => {
    const { wallets, refetch } = useWallets();
    const { requestWithdraw, loading, error, success } = useWithdraw();

    const [currency, setCurrency] = useState<SupportedCurrency>('BTC');
    const [amount, setAmount] = useState('');
    const [toAddress, setToAddress] = useState('');

    const CURRENCIES: SupportedCurrency[] = [
        'BTC',
        'ETH',
        'USDT',
        'BNB',
        'SOL',
        'XRP',
    ];

    const balance =
        wallets.find((w) => w.currency === currency)?.balance ?? 0;

    const amtNum = parseFloat(amount) || 0;
    const fee = amtNum * 0.002;
    const total = amtNum + fee;

    const handleWithdraw = async () => {
        if (!amtNum || !toAddress) return;
        await requestWithdraw(currency, amtNum, toAddress);
        setAmount('');
        setToAddress('');
        refetch();
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Withdraw Crypto
                </h1>
                <p className="text-slate-400 mb-8">
                    Send crypto to an external wallet address. 0.2% network fee applies.
                </p>

                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6 space-y-6">

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Currency
                        </label>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all duration-200">
                            <select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(
                                        e.target.value as SupportedCurrency
                                    )
                                }
                                className="w-full bg-transparent text-white font-semibold focus:outline-none"
                            >
                                {CURRENCIES.map((c) => (
                                    <option
                                        key={c}
                                        value={c}
                                        className="bg-slate-900"
                                    >
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-slate-500 text-xs mt-2">
                            Available:{' '}
                            <span className="text-slate-300 font-medium">
                                {balance.toFixed(6)} {currency}
                            </span>
                        </p>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Amount
                        </label>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all duration-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-xs">
                                    Enter amount
                                </span>

                                <button
                                    onClick={() =>
                                        setAmount(
                                            (balance * 0.99).toFixed(6)
                                        )
                                    }
                                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                                >
                                    MAX
                                </button>
                            </div>

                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                placeholder="0.00"
                                className="w-full bg-transparent text-white text-lg font-semibold focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">
                            Destination Address
                        </label>

                        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-all duration-200">
                            <input
                                type="text"
                                value={toAddress}
                                onChange={(e) =>
                                    setToAddress(e.target.value)
                                }
                                placeholder="Paste wallet address here"
                                className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {amtNum > 0 && (
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-4 space-y-2 text-sm">
                            <div className="flex justify-between text-slate-300">
                                <span>Amount</span>
                                <span className="text-white">
                                    {amtNum.toFixed(6)} {currency}
                                </span>
                            </div>

                            <div className="flex justify-between text-slate-300">
                                <span>Network Fee (0.2%)</span>
                                <span className="text-rose-400">
                                    {fee.toFixed(6)} {currency}
                                </span>
                            </div>

                            <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-200 font-semibold">
                                <span>Total Deducted</span>
                                <span>
                                    {total.toFixed(6)} {currency}
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
                        onClick={handleWithdraw}
                        disabled={
                            loading ||
                            !amtNum ||
                            !toAddress ||
                            total > balance
                        }
                        className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? 'Processing…'
                            : `Withdraw ${currency}`}
                    </button>

                    {total > balance && amtNum > 0 && (
                        <p className="text-rose-400 text-sm text-center">
                            Insufficient balance (need {total.toFixed(6)} {currency} including fee)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};