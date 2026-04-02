import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

const PREFERENCE_KEY = 'user_preferences';

export async function GET() {
    try {
        const sessionUser = await getUser();
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const setting = await prisma.globalSetting.findUnique({
            where: { key: `${PREFERENCE_KEY}_${sessionUser.id}` },
        });

        const preferences = setting ? JSON.parse(setting.value) : {
            emailNotifications: true,
            desktopNotifications: true,
            theme: 'dark',
            language: 'en',
            timezone: 'UTC',
            compactMode: false,
            showCompletedTickets: true,
            defaultView: 'intelligence',
        };

        return NextResponse.json(preferences);
    } catch (error) {
        console.error('Get preferences error:', error);
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
        const {
            emailNotifications,
            desktopNotifications,
            theme,
            language,
            timezone,
            compactMode,
            showCompletedTickets,
            defaultView,
        } = body;

        // Validate theme
        if (theme && !['dark', 'light', 'system'].includes(theme)) {
            return NextResponse.json({ error: 'Invalid theme value' }, { status: 400 });
        }

        // Validate defaultView
        const validViews = ['kanban', 'list', 'reports', 'calendar', 'intelligence', 'sla'];
        if (defaultView && !validViews.includes(defaultView)) {
            return NextResponse.json({ error: 'Invalid default view' }, { status: 400 });
        }

        const preferences = {
            emailNotifications: emailNotifications ?? true,
            desktopNotifications: desktopNotifications ?? true,
            theme: theme ?? 'dark',
            language: language ?? 'en',
            timezone: timezone ?? 'UTC',
            compactMode: compactMode ?? false,
            showCompletedTickets: showCompletedTickets ?? true,
            defaultView: defaultView ?? 'intelligence',
        };

        await prisma.globalSetting.upsert({
            where: { key: `${PREFERENCE_KEY}_${sessionUser.id}` },
            update: { value: JSON.stringify(preferences) },
            create: { key: `${PREFERENCE_KEY}_${sessionUser.id}`, value: JSON.stringify(preferences) },
        });

        return NextResponse.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
        console.error('Update preferences error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}