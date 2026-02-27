import mongoose from 'mongoose';
import { env } from '../config/env';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
