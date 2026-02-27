import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'admin';

export interface IRefreshToken {
    token: string;
    expiresAt: Date;
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    refreshTokens: IRefreshToken[];
    comparePassword(password: string): Promise<boolean>;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true },
        passwordHash: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        refreshTokens: { type: [RefreshTokenSchema], default: [] },
    },
    { timestamps: true }
);

UserSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
