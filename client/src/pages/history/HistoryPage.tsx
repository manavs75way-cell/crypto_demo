import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Transaction, TxType } from '../../types';

const TYPE_BADGE: Record<TxType, string> = {
    DEPOSIT: 'bg-emerald-500/20 text-emerald-400',
    TRADE: 'bg-indigo-500/20 text-indigo-400',
    WITHDRAW: 'bg-rose-500/20 text-rose-400',
};
const STATUS_COLOR: Record<string, string> = {
    COMPLETED: 'text-emerald-400', PENDING: 'text-amber-400', FAILED: 'text-red-400',
};

export const HistoryPage = () => {
    const [txs, setTxs] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'ALL' | TxType>('ALL');

    useEffect(() => {
        const fetchAll = async () => {
            const [dep, trade, wd] = await Promise.all([
                api.get<{ transactions: Transaction[] }>('/deposit/history'),
                api.get<{ transactions: Transaction[] }>('/trade/history'),
                api.get<{ transactions: Transaction[] }>('/withdraw/history'),
            ]);
            const all = [...dep.data.transactions, ...trade.data.transactions, ...wd.data.transactions];
            all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setTxs(all);
            setLoading(false);
        };
        fetchAll().catch(() => setLoading(false));
    }, []);

    const filtered = tab === 'ALL' ? txs : txs.filter((t) => t.type === tab);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Transaction History</h1>
            <p className="text-slate-400 mb-6">All your deposits, trades, and withdrawals.</p>

            <div className="flex gap-2 mb-6">
                {(['ALL', 'DEPOSIT', 'TRADE', 'WITHDRAW'] as const).map((t) => (
                    <button
                        key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                        {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-5xl mb-4">📭</p>
                    <p className="text-slate-400">No transactions yet</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Type</th>
                                <th className="text-left px-6 py-4 text-slate-400 text-sm font-medium">Details</th>
                                <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Amount</th>
                                <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
                                <th className="text-right px-6 py-4 text-slate-400 text-sm font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((tx) => (
                                <tr key={tx._id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${TYPE_BADGE[tx.type]}`}>{tx.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-sm max-w-xs truncate">{tx.note ?? '—'}</td>
                                    <td className="px-6 py-4 text-right font-mono text-white text-sm">
                                        {tx.amount.toFixed(6)} {tx.currency}
                                        {tx.toAmount && <span className="text-slate-400"> → {tx.toAmount.toFixed(6)} {tx.toCurrency}</span>}
                                    </td>
                                    <td className={`px-6 py-4 text-right text-sm font-semibold ${STATUS_COLOR[tx.status] ?? 'text-slate-400'}`}>{tx.status}</td>
                                    <td className="px-6 py-4 text-right text-slate-400 text-sm whitespace-nowrap">
                                        {new Date(tx.createdAt).toLocaleDateString()}{' '}
                                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
