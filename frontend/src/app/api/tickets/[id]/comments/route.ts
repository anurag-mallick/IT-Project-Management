import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (req: NextRequest, user: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: { ticketId: parseInt(id) },
      include: { author: { select: { name: true, username: true } } },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(comments);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest, user: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const { content } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: parseInt(id),
        // Fallback since supabase user doesn't map to int ID yet directly without trigger map setup
        authorName: user?.email || 'Unknown User'
      },
      include: { author: { select: { name: true, username: true } } }
    });
    return NextResponse.json(comment);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 400 });
  }
});
