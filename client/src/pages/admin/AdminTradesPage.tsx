import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';

interface TradeRecord {
    _id: string;
    userId: { email: string; firstName: string; lastName: string } | string;
    type: string;
    currency: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount: number;
    toAmount?: number;
    fee: number;
    status: string;
    createdAt: string;
}

export const AdminTradesPage = () => {
    const [trades, setTrades] = useState<TradeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const { data } = await adminApi.getAllTrades(page);
                setTrades(data.trades);
                setTotalPages(data.totalPages);
            } catch { setTrades([]); }
            finally { setLoading(false); }
        };
        fetch();
    }, [page]);

    const getUserEmail = (userId: TradeRecord['userId']) => {
        if (typeof userId === 'object') return userId.email;
        return userId;
    };

    const typeBadge = (type: string) => {
        const colors: Record<string, string> = {
            DEPOSIT: 'bg-emerald-500/20 text-emerald-400',
            TRADE: 'bg-indigo-500/20 text-indigo-400',
            WITHDRAW: 'bg-orange-500/20 text-orange-400',
        };
        return colors[type] || 'bg-slate-700 text-slate-300';
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-1">All Transactions</h1>
            <p className="text-slate-400 mb-6">View all deposits, trades, and withdrawals across the platform.</p>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left text-slate-400 font-medium px-5 py-4">User</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Type</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Details</th>
                            <th className="text-right text-slate-400 font-medium px-5 py-4">Amount</th>
                            <th className="text-right text-slate-400 font-medium px-5 py-4">Fee</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Status</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Loading…</td></tr>
                        ) : trades.length === 0 ? (
                            <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">No transactions found</td></tr>
                        ) : trades.map((t) => (
                            <tr key={t._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4 text-white">{getUserEmail(t.userId)}</td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeBadge(t.type)}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-300">
                                    {t.type === 'TRADE' ? `${t.fromCurrency} → ${t.toCurrency}` : t.currency}
                                </td>
                                <td className="px-5 py-4 text-right text-white font-medium">{t.amount.toFixed(6)}</td>
                                <td className="px-5 py-4 text-right text-slate-400">{t.fee.toFixed(6)}</td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 text-sm transition-all"
                    >
                        ← Previous
                    </button>
                    <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 text-sm transition-all"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};
