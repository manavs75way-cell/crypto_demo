import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminGuard = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-400">Loading…</div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
