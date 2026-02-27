import { z } from 'zod';

export const kycSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    idType: z.enum(['PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE']),
    idNumber: z.string().min(3, 'ID number is required'),
    address: z.string().min(5, 'Address is required'),
});

export type KycInput = z.infer<typeof kycSchema>;
