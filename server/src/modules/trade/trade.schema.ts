import { z } from 'zod';

export const tradeSchema = z.object({
    fromCurrency: z.enum(['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP']),
    toCurrency: z.enum(['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP']),
    amount: z.number().positive('Amount must be positive'),
}).refine((d) => d.fromCurrency !== d.toCurrency, {
    message: 'From and To currencies must be different',
});

export type TradeInput = z.infer<typeof tradeSchema>;
