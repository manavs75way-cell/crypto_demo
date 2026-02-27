import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(form.email, form.password);
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.role === 'admin') {
                        navigate('/admin');
                        return;
                    }
                } catch { /* fallthrough to default */ }
            }
            navigate('/');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <div className="flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 w-full">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-3xl mb-4 shadow-lg shadow-indigo-500/30">₿</div>
                        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                        <p className="text-slate-400 mt-2">Sign in to your CryptoX account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
                        )}

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email" required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password" required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Your password"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>

                        <p className="text-center text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
            <div className="hidden lg:block lg:flex-1 relative">
                <img src="/bitcoin.webp" alt="Trading platform preview" className="absolute inset-0 w-full h-full object-cover" />
            </div>
        </div>
    );
};
