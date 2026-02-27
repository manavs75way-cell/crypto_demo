import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
    registerService,
    loginService,
    refreshService,
    logoutService,
    getMeService,
} from './auth.service';
import { env } from '../../config/env';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await registerService(req.body);
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.status(201).json({ success: true, accessToken: result.accessToken, user: result.user });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await loginService(req.body);
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.json({ success: true, accessToken: result.accessToken, user: result.user });
    } catch (err) {
        next(err);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken as string | undefined;
        if (!token) {
            res.status(401).json({ success: false, message: 'No refresh token' });
            return;
        }
        const result = await refreshService(token);
        res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
        res.json({ success: true, accessToken: result.accessToken });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken as string | undefined;
        if (req.userId && token) {
            await logoutService(req.userId, token);
        }
        res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, domain: undefined });
        res.json({ success: true, message: 'Logged out' });
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getMeService(req.userId!);
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

void env; // suppress unused warning
