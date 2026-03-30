import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSLABreachEmail } from '@/lib/email';
import { TicketStatus, TicketPriority } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const secret = process.env.SLA_CRON_SECRET;

    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    
    // SLA Definitions (Hours since last update)
    const SLA_THRESHOLDS = {
      [TicketPriority.P0]: 1,
      [TicketPriority.P1]: 4,
      [TicketPriority.P2]: 8,
      [TicketPriority.P3]: 24, // Optional extra
    };

    let checked = 0;
    let escalated = 0;

    // Find open tickets
    const openTickets = await prisma.ticket.findMany({
      where: {
        status: {
          notIn: [TicketStatus.RESOLVED, TicketStatus.CLOSED]
        }
      },
      include: {
        assignedTo: {
          select: { email: true, username: true }
        }
      }
    });

    checked = openTickets.length;

    for (const ticket of openTickets) {
      const thresholdHours = SLA_THRESHOLDS[ticket.priority as keyof typeof SLA_THRESHOLDS] || 8;
      const lastUpdate = new Date(ticket.updatedAt);
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceUpdate > thresholdHours) {
        const assigneeEmail = ticket.assignedTo?.email || ticket.assignedTo?.username;
        if (assigneeEmail) {
          await sendSLABreachEmail(
            { id: ticket.id, title: ticket.title, priority: ticket.priority },
            assigneeEmail
          );
          escalated++;
        }
      }
    }

    return NextResponse.json({ checked, escalated });
  } catch (error: any) {
    console.error('SLA Check Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
