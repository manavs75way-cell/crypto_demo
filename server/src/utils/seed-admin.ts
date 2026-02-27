import bcrypt from 'bcryptjs';
import { User } from '../modules/auth/user.model';

export const seedAdmin = async (): Promise<void> => {
    const adminEmail = 'admin@cryptox.com';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
        if (existing.role !== 'admin') {
            existing.role = 'admin';
            await existing.save();
        }
        return;
    }

    const passwordHash = await bcrypt.hash('admin123', 12);
    await User.create({
        email: adminEmail,
        passwordHash,
        firstName: 'Admin',
        lastName: 'CryptoX',
        role: 'admin',
    });
    console.log('Seeded admin user: admin@cryptox.com \n password: admin123');
};
