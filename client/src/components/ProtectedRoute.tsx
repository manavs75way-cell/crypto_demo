import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};
