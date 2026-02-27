import { useState, useEffect } from 'react';
import { walletApi } from '../../api/wallet.api';
import { useDeposit } from '../../hooks/useDeposit';
import { useWallets } from '../../hooks/useWallets';
import { SupportedCurrency, Wallet } from '../../types';

const AMOUNTS: Record<SupportedCurrency, number[]> = {
    BTC: [0.001, 0.01, 0.1],
    ETH: [0.01, 0.1, 1],
    USDT: [100, 500, 1000],
    BNB: [0.1, 1, 5],
    SOL: [1, 10, 50],
    XRP: [100, 500, 1000],
};

export const DepositPage = () => {
    const [currency, setCurrency] = useState<SupportedCurrency>('BTC');
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [copied, setCopied] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { simulateDeposit, loading, error } = useDeposit();
    const { refetch } = useWallets();

    useEffect(() => {
        walletApi.getAddress(currency).then(({ data }) =>
            setWallet(data.wallet)
        );
    }, [currency]);

    const handleDeposit = async (amount: number) => {
        await simulateDeposit(currency, amount);
        setSuccessMsg(`${amount} ${currency} deposited successfully!`);
        refetch();
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    const handleCopy = () => {
        if (wallet?.address) {
            navigator.clipboard.writeText(wallet.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const CURRENCIES: SupportedCurrency[] = [
        'BTC',
        'ETH',
        'USDT',
        'BNB',
        'SOL',
        'XRP',
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Deposit Crypto
                </h1>
                <p className="text-slate-400 mb-8">
                    Select a currency and copy your deposit address or use the demo simulator.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {CURRENCIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCurrency(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currency === c
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Address Card */}
                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6 mb-6">
                    <p className="text-slate-400 text-sm font-medium mb-3">
                        Your {currency} Deposit Address
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">
                            <p className="font-mono text-white text-sm break-all">
                                {wallet?.address ?? 'Loading…'}
                            </p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="shrink-0 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl font-medium transition-all duration-200 disabled:bg-slate-700"
                        >
                            {copied ? '✓ Copied' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold">
                            Deposit
                        </span>
                        <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
                            Demo
                        </span>
                    </div>

                    <p className="text-slate-400 text-sm mb-5">
                        Click an amount to instantly add funds to your wallet.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm mb-4">
                            {successMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                        {(AMOUNTS[currency] ?? []).map((amt) => (
                            <button
                                key={amt}
                                onClick={() => handleDeposit(amt)}
                                disabled={loading}
                                className="py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                +{amt} {currency}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};