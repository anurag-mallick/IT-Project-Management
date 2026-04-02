import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Find the reset token in global settings
        const resetSetting = await prisma.globalSetting.findFirst({
            where: {
                key: { startsWith: 'reset_token_' },
            },
        });

        if (!resetSetting) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const { token: storedToken, expiry } = JSON.parse(resetSetting.value);

        // Check if token matches and is not expired
        if (storedToken !== token) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        if (new Date() > new Date(expiry)) {
            // Clean up expired token
            await prisma.globalSetting.delete({
                where: { key: resetSetting.key },
            });
            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 400 }
            );
        }

        // Extract user ID from the key
        const userId = parseInt(resetSetting.key.replace('reset_token_', ''));

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        // Clean up used token
        await prisma.globalSetting.delete({
            where: { key: resetSetting.key },
        });

        return NextResponse.json(
            { message: 'Password has been reset successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}