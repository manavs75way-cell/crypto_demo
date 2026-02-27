import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { KycGuard } from './components/KycGuard';
import { AdminGuard } from './components/AdminGuard';
import { AppLayout } from './components/AppLayout';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { KycPage } from './pages/kyc/KycPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { DepositPage } from './pages/deposit/DepositPage';
import { TradePage } from './pages/trade/TradePage';
import { WithdrawPage } from './pages/withdraw/WithdrawPage';
import { HistoryPage } from './pages/history/HistoryPage';
import { AdminKycPage } from './pages/admin/AdminKycPage';
import { AdminTradesPage } from './pages/admin/AdminTradesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export const router = createBrowserRouter([
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/kyc', element: <KycPage /> },
            {
                element: <KycGuard />,
                children: [
                    {
                        element: <AppLayout />,
                        children: [
                            { index: true, element: <DashboardPage /> },
                            { path: 'deposit', element: <DepositPage /> },
                            { path: 'trade', element: <TradePage /> },
                            { path: 'withdraw', element: <WithdrawPage /> },
                            { path: 'history', element: <HistoryPage /> },
                        ],
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminGuard />,
                children: [
                    {
                        element: <AdminLayout />,
                        children: [
                            { path: 'admin', element: <AdminKycPage /> },
                            { path: 'admin/trades', element: <AdminTradesPage /> },
                            { path: 'admin/users', element: <AdminUsersPage /> },
                        ],
                    },
                ],
            },
        ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
]);

