import api from './axios';
import type { User } from '../types';

export interface AuthResponse {
    success: boolean;
    accessToken: string;
    user: User;
}

export const authApi = {
    register: (data: 
        { 
            email: string; 
            password: string; 
            firstName: string; 
            lastName: string 
        }
    ) =>
        api.post<AuthResponse>('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>('/auth/login', data),

    logout: () => api.post('/auth/logout'),

    getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),
};
