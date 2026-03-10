const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/authMiddleware');

// Internal: Professional Ticket Management
router.get('/tickets', authenticate, async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    include: { assignedTo: { select: { username: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(tickets);
});

// External: Anonymous Ticket Submission
router.post('/public/tickets', async (req, res) => {
  const { title, description, requesterName, priority } = req.body;
  
  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        requesterName: requesterName || 'Anonymous',
        priority: priority || 'MEDIUM',
        status: 'TODO'
      }
    });

    // Handle initial SLA calculation here or via worker
    res.json({ message: 'Ticket submitted successfully', ticketId: newTicket.id });
  } catch (e) {
    res.status(400).json({ error: 'Failed to submit ticket' });
  }
});

// Update ticket status
router.patch('/tickets/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status, priority, title, description } = req.body;

  try {
    // 1. Fetch current state to detect transitions
    const currentTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentTicket) return res.status(404).json({ error: 'Ticket not found' });

    // 2. Perform the update
    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: { status, priority, title, description }
    });

    // 3. Generate automated comments for transitions
    const changes = [];
    if (status && status !== currentTicket.status) {
      changes.push(`status from **${currentTicket.status}** to **${status}**`);
    }
    if (priority && priority !== currentTicket.priority) {
      changes.push(`priority from **${currentTicket.priority}** to **${priority}**`);
    }

    if (changes.length > 0) {
      await prisma.comment.create({
        data: {
          content: `System: Updated ${changes.join(' and ')}`,
          ticketId: parseInt(id),
          authorId: req.user.id
        }
      });
    }

    res.json(updatedTicket);
  } catch (e) {
    res.status(400).json({ error: 'Failed to update ticket' });
  }
});

// Get comments for a ticket
router.get('/tickets/:id/comments', authenticate, async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: { ticketId: parseInt(id) },
    include: { author: { select: { name: true, username: true } } },
    orderBy: { createdAt: 'asc' }
  });
  res.json(comments);
});

// Add a comment to a ticket
router.post('/tickets/:id/comments', authenticate, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const authorId = req.user.id; // From authMiddleware

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: parseInt(id),
        authorId
      },
      include: { author: { select: { name: true, username: true } } }
    });
    res.json(comment);
  } catch (e) {
    res.status(400).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
