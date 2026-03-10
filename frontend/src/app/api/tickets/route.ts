import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (req: NextRequest, user: any) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { 
        assignedTo: { select: { id: true, username: true, name: true } },
        comments: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest, user: any) => {
  try {
    const body = await req.json();
    const { title, description, priority, status, assignedToId } = body;
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || 'P2',
        status: status || 'TODO',
        assignedToId: assignedToId ? parseInt(assignedToId) : undefined,
      },
      include: { assignedTo: { select: { id: true, username: true, name: true } } }
    });
    return NextResponse.json(ticket);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 400 });
  }
});
