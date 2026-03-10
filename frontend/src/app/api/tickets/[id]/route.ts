import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth';

export const PATCH = withAuth(async (req: NextRequest, user: any, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, priority, title, description, assignedToId } = body;

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentTicket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if ('assignedToId' in body) {
      data.assignedToId = assignedToId ? parseInt(assignedToId) : null;
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data,
      include: { assignedTo: { select: { id: true, username: true, name: true } } }
    });

    const changes = [];
    if (status && status !== currentTicket.status) {
      changes.push(`status from **${currentTicket.status}** to **${status}**`);
    }
    if (priority && priority !== currentTicket.priority) {
      changes.push(`priority from **${currentTicket.priority}** to **${priority}**`);
    }

    if (changes.length > 0 && user.id) { // We map Supabase email user IDs? Wait, our User ID logic!
      // In the future this should map user email -> prisma user.id
      // For now we'll create system logs without author if they don't have integer id
      await prisma.comment.create({
        data: {
          content: `System: Updated ${changes.join(' and ')}`,
          ticketId: parseInt(id),
          authorName: user.email || 'System'
        }
      });
    }

    return NextResponse.json(updatedTicket);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 400 });
  }
});
