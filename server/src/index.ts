import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/mongoose';
import { env } from './config/env';
import router from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { startPriceFeed } from './utils/crypto-prices';
import { seedAdmin } from './utils/seed-admin';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

const init = async () => {
    await connectDB();
    await seedAdmin();
    startPriceFeed();
    app.listen(Number(env.PORT), () => {
        console.log(`Server running at http://localhost:${env.PORT}`);
    });
};

init().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
