import { z } from 'zod';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const envSchema = z.object({
    PORT: z.string().default('5000'),
    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    REFRESH_SECRET: z.string().min(1, 'REFRESH_SECRET is required'),
    REFRESH_EXPIRES_IN: z.string().default('7d'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
