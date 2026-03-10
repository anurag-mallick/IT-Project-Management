const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkSLAs = async () => {
  console.log('Checking SLAs...');
  const now = new Date();
  
  // Find open tickets that have passed their breach time
  const breachedTickets = await prisma.ticket.findMany({
    where: {
      status: 'OPEN',
      slaBreachAt: { lt: now }
    }
  });

  for (const ticket of breachedTickets) {
    // Action: Automated escalation
    console.log(`Ticket ${ticket.id} breached SLA! Escalating...`);
    // Example: Update priority or notify admin
  }
};

const runAutomations = async () => {
  console.log('Running Automations...');
  // Logic for custom triggers and actions
};

// Start the worker loop
const startWorker = () => {
  setInterval(async () => {
    try {
      await checkSLAs();
      await runAutomations();
    } catch (e) {
      console.error('Worker error:', e);
    }
  }, 60000); // Run every minute
};

module.exports = { startWorker };
