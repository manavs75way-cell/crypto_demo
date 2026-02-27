import api from './axios';

export const adminApi = {
    getPendingKyc: () => api.get('/admin/kyc/pending'),
    reviewKyc: (id: string, action: 'APPROVED' | 'REJECTED', reason?: string) =>
        api.patch(`/admin/kyc/${id}/review`, { action, reason }),
    getAllTrades: (page = 1, limit = 20) =>
        api.get(`/admin/trades?page=${page}&limit=${limit}`),
    getAllUsers: () => api.get('/admin/users'),
};
