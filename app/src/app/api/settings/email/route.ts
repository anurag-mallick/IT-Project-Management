import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (req, user) => {
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const keys = [
    'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM',
    'IMAP_HOST', 'IMAP_PORT', 'IMAP_USER', 'IMAP_PASS', 'IMAP_TICKET_FOLDER'
  ];

  const settings = await prisma.globalSetting.findMany({
    where: {
      key: { in: keys }
    }
  });

  const settingsMap = settings.reduce((acc: Record<string, string>, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return NextResponse.json(settingsMap);
});

export const POST = withAuth(async (req, user) => {
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await req.json();

  const updates = Object.entries(data).map(([key, value]) => {
    return prisma.globalSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  });

  await Promise.all(updates);

  return NextResponse.json({ success: true });
});
