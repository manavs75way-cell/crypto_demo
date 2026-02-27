import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
    userId?: string;
    role?: 'user' | 'admin';
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role?: string };
        req.userId = decoded.userId;
        req.role = (decoded.role as 'user' | 'admin') || 'user';
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

