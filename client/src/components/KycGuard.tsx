import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { kycApi } from '../api/kyc.api';
import { KycRecord } from '../types';
import { useAuth } from '../context/AuthContext';

export const KycGuard = () => {
    const { user } = useAuth();
    const [kyc, setKyc] = useState<KycRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        kycApi.getStatus()
            .then(({ data }) => setKyc(data.kyc))
            .catch(() => setKyc(null))
            .finally(() => setLoading(false));
    }, [user]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    if (!kyc || kyc.status !== 'APPROVED') return <Navigate to="/kyc" replace />;

    return <Outlet />;
};
