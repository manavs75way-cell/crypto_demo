import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';

interface UserRecord {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    kycStatus: string;
    createdAt: string;
}

export const AdminUsersPage = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await adminApi.getAllUsers();
                setUsers(data.users);
            } catch { setUsers([]); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const kycBadge = (status: string) => {
        const map: Record<string, string> = {
            APPROVED: 'bg-emerald-500/20 text-emerald-400',
            PENDING: 'bg-amber-500/20 text-amber-400',
            REJECTED: 'bg-red-500/20 text-red-400',
            NOT_SUBMITTED: 'bg-slate-700 text-slate-400',
        };
        return map[status] || 'bg-slate-700 text-slate-400';
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-white mb-1">All Users</h1>
            <p className="text-slate-400 mb-6">View all registered users and their KYC status.</p>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Name</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Email</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Role</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">KYC Status</th>
                            <th className="text-left text-slate-400 font-medium px-5 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Loading…</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No users found</td></tr>
                        ) : users.map((u) => (
                            <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                            {u.firstName[0]}{u.lastName[0]}
                                        </div>
                                        <span className="text-white font-medium">{u.firstName} {u.lastName}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-300">{u.email}</td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${kycBadge(u.kycStatus)}`}>
                                        {u.kycStatus}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
