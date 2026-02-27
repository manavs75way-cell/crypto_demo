import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth.api';
import { kycApi } from '../api/kyc.api';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    kycStatus: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshKycStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accessToken')
    );
    const [kycStatus, setKycStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshKycStatus = async () => {
        try {
            const { data } = await kycApi.getStatus();
            setKycStatus(data.kyc?.status ?? null);
        } catch {
            setKycStatus(null);
        }
    };

    useEffect(() => {
        const restore = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) { setIsLoading(false); return; }
            try {
                const { data } = await authApi.getMe();
                setUser(data.user);
                await refreshKycStatus();
            } catch {
                localStorage.removeItem('accessToken');
                setUser(null);
                setAccessToken(null);
                setKycStatus(null);
            } finally {
                setIsLoading(false);
            }
        };
        restore();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await authApi.login({ email, password });
        localStorage.setItem('accessToken', data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
        await refreshKycStatus();
    };

    const register = async (formData: { email: string; password: string; firstName: string; lastName: string }) => {
        const { data } = await authApi.register(formData);
        localStorage.setItem('accessToken', data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
        setKycStatus(null); // Fresh signup, no KYC yet
    };

    const logout = async () => {
        try { await authApi.logout(); } catch { }
        localStorage.removeItem('accessToken');
        setUser(null);
        setAccessToken(null);
        setKycStatus(null);
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, kycStatus, isLoading, login, register, logout, refreshKycStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
