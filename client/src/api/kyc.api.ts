import api from './axios';
import { KycRecord } from '../types';

export const kycApi = {
    submit: (data: {
        fullName: string;
        dob: string;
        nationality: string;
        idType: string;
        idNumber: string;
        address: string;
    }) => api.post<{ success: boolean; kyc: KycRecord }>('/kyc/submit', data),

    getStatus: () => api.get<{ success: boolean; kyc: KycRecord | null }>('/kyc/status'),
};
