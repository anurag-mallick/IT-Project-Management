import { NextRequest, NextResponse } from 'next/server';
import { withAuth, SessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const GET = withAuth(async (req: NextRequest, user: SessionUser) => {
  try {
    const filePathParam = req.nextUrl.searchParams.get('path');
    if (!filePathParam) {
      return NextResponse.json({ error: 'No path specified' }, { status: 400 });
    }

    // Since the path param might just be the filename or a relative path, 
    // we search our DB for a matching attachment.
    const attachment = await prisma.attachment.findFirst({
      where: {
        OR: [
          { filePath: filePathParam },
          { filePath: { endsWith: filePathParam } }
        ]
      },
      include: {
        ticket: {
          select: {
            id: true,
            assignedToId: true,
            requesterName: true
          }
        }
      }
    });

    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    // Fetch user details including database role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true, name: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User forbidden' }, { status: 403 });
    }

    // Ownership check: ADMIN, STAFF, or the ticket's assignee/requester
    const isAuthorized = 
      dbUser.role === 'ADMIN' || 
      dbUser.role === 'STAFF' || 
      attachment.ticket.assignedToId === dbUser.id ||
      attachment.ticket.requesterName === dbUser.name;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Redirect to the stored public URL
    // For Neon stack: In a real implementation you'd use Vercel Blob or similar.
    // For now, return the filePath directly if it's already a public URL or relative path.
    const finalUrl = attachment.filePath.startsWith('http') 
      ? attachment.filePath 
      : attachment.filePath.startsWith('/') ? attachment.filePath : `/${attachment.filePath}`;

    return NextResponse.redirect(new URL(finalUrl, req.url));
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
