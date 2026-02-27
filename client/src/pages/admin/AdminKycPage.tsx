import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';

interface KycApplication {
    _id: string;
    userId: { _id: string; email: string; firstName: string; lastName: string } | string;
    fullName: string;
    dob: string;
    nationality: string;
    idType: string;
    idNumber: string;
    address: string;
    status: string;
    createdAt: string;
}

export const AdminKycPage = () => {
    const [applications, setApplications] = useState<KycApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const fetchPending = useCallback(async () => {
        try {
            const { data } = await adminApi.getPendingKyc();
            setApplications(data.applications);
        } catch { setApplications([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
        setActioning(id);
        try {
            await adminApi.reviewKyc(id, action, rejectionReason);
            setMsg(`KYC ${action.toLowerCase()} successfully`);
            setRejectId(null);
            setReason('');
            await fetchPending();
            setTimeout(() => setMsg(''), 3000);
        } catch {
            setMsg('Action failed');
        } finally { setActioning(null); }
    };

    const getUserInfo = (userId: KycApplication['userId']) => {
        if (typeof userId === 'object') return userId;
        return { email: '', firstName: '', lastName: '' };
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-slate-400">Loading pending applications…</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-1">KYC Review</h1>
            <p className="text-slate-400 mb-6">Review and approve or reject pending KYC applications.</p>

            {msg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm mb-6">
                    {msg}
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-slate-400">No pending KYC applications</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => {
                        const userInfo = getUserInfo(app.userId);
                        const isExpanded = expandedId === app._id;
                        return (
                            <div key={app._id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-800/50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : app._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                            {app.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{app.fullName}</p>
                                            <p className="text-slate-400 text-sm">{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-medium">
                                            PENDING
                                        </span>
                                        <span className="text-slate-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-slate-800 p-5">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {[
                                                ['Full Name', app.fullName],
                                                ['Date of Birth', app.dob],
                                                ['Nationality', app.nationality],
                                                ['ID Type', app.idType],
                                                ['ID Number', app.idNumber],
                                                ['Address', app.address],
                                                ['Submitted', new Date(app.createdAt).toLocaleDateString()],
                                            ].map(([label, value]) => (
                                                <div key={label}>
                                                    <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
                                                    <p className="text-white text-sm">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {rejectId === app._id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    rows={3}
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder="Reason for rejection…"
                                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAction(app._id, 'REJECTED', reason)}
                                                        disabled={actioning === app._id}
                                                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                                                    >
                                                        {actioning === app._id ? 'Rejecting…' : 'Confirm Reject'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setRejectId(null); setReason(''); }}
                                                        className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-medium transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAction(app._id, 'APPROVED')}
                                                    disabled={actioning === app._id}
                                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                                                >
                                                    {actioning === app._id ? 'Approving…' : '✓ Approve'}
                                                </button>
                                                <button
                                                    onClick={() => setRejectId(app._id)}
                                                    className="px-6 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-semibold transition-all"
                                                >
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
