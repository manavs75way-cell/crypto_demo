import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { env } from '../../config/env';
import { RegisterInput, LoginInput } from './auth.schema';

const generateTokens = (userId: string, role: string) => {
    const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, {
        expiresIn: (env.JWT_EXPIRES_IN || '15m') as unknown as number,
    });
    const refreshToken = jwt.sign({ userId, role }, env.REFRESH_SECRET, {
        expiresIn: (env.REFRESH_EXPIRES_IN || '7d') as unknown as number,
    });
    return { accessToken, refreshToken };
};

export const registerService = async (data: RegisterInput) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    };
};

export const loginService = async (data: LoginInput) => {
    const user = await User.findOne({ email: data.email });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const valid = await user.comparePassword(data.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    };
};

export const refreshService = async (refreshToken: string) => {
    let decoded: { userId: string };
    try {
        decoded = jwt.verify(refreshToken, env.REFRESH_SECRET) as { userId: string };
    } catch {
        throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const stored = user.refreshTokens.find((t) => t.token === refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
        throw Object.assign(new Error('Refresh token expired'), { statusCode: 401 });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user._id.toString(), user.role);
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ token: newRefresh, expiresAt });
    await user.save();

    return { accessToken, refreshToken: newRefresh };
};

export const logoutService = async (userId: string, refreshToken: string) => {
    const user = await User.findById(userId);
    if (!user) return;
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    await user.save();
};

export const getMeService = async (userId: string) => {
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return user;
};
