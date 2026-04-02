import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const sessionUser = await getUser();
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const sessionUser = await getUser();
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, currentPassword, newPassword } = body;

        // Get current user
        const currentUser = await prisma.user.findUnique({
            where: { id: sessionUser.id },
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If changing password, verify current password
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
            }

            const bcrypt = require('bcryptjs');
            const isValid = await bcrypt.compare(currentPassword, currentUser.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }

            if (newPassword.length < 6) {
                return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: sessionUser.id },
                data: { password: hashedPassword },
            });
        }

        // Update other fields
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) {
            // Check if email is already taken
            if (email !== currentUser.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
                }
            }
            updateData.email = email;
        }

        if (Object.keys(updateData).length > 0) {
            await prisma.user.update({
                where: { id: sessionUser.id },
                data: updateData,
            });
        }

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}