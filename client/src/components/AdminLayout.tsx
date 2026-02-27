import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_NAV = [
    { to: '/admin', label: 'KYC Review', icon: '/review.svg' },
    { to: '/admin/trades', label: 'All Trades', icon: '/trade.svg' },
    { to: '/admin/users', label: 'Users', icon: '/users.svg' },
];

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-white">

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col shadow-2xl">

                {/* Header */}
                <div className="px-6 py-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <img src="/admin.svg" alt="Admin" className="w-5 h-5 invert brightness-0" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>

                        <div>
                            <span className="text-white font-bold text-xl tracking-wide">
                                CryptoX
                            </span>
                            <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                                Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {ADMIN_NAV.map(({ to, label, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/admin'}
                            className={({ isActive }) =>
                                `group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`w-5 h-5 transition-all duration-200 ${isActive
                                                ? 'opacity-100'
                                                : 'opacity-70 group-hover:opacity-100'
                                            }`}
                                        style={{ filter: 'brightness(0) invert(1)' }}
                                    />
                                    <span>{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section */}
                <div className="px-4 py-5 border-t border-slate-800/50">

                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/70 border border-slate-700/50 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                        </div>

                        <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-slate-400 text-xs truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium transition-all duration-200 border border-transparent hover:border-red-500/20"
                    >
                        <img src="/logout.svg" alt="Logout" className="w-4 h-4 opacity-80" style={{ filter: 'brightness(0) invert(1)' }} />
                        Logout
                    </button>
                </div>
            </aside>


            <main className="flex-1 ml-72 min-h-screen overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};