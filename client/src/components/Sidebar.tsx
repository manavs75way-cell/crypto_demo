import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: '/dashboard.svg' },
    { to: '/deposit', label: 'Deposit', icon: '/deposit.svg' },
    { to: '/trade', label: 'Trade', icon: '/trade.svg' },
    { to: '/withdraw', label: 'Withdraw', icon: '/withdraw.svg' },
    { to: '/history', label: 'History', icon: '/history.svg' },
];

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">₿</div>
                    <span className="text-white font-bold text-xl tracking-wide">CryptoX</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`
                        }
                    >
                        <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                            <img src={icon} alt={label} className="w-full h-full object-contain [filter:brightness(0)_invert(1)] opacity-70 group-hover:opacity-100 transition-opacity" />
                        </span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium transition-all"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};
