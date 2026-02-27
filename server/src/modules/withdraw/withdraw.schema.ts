import { z } from 'zod';

export const withdrawSchema = z.object({
    currency: z.enum(['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP']),
    amount: z.number().positive('Amount must be positive'),
    toAddress: z.string().min(10, 'Destination address is required'),
});

export type WithdrawInput = z.infer<typeof withdrawSchema>;
