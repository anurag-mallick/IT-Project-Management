const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { startWorker } = require('./worker');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

startWorker();
const io = new Server(server, {
  cors: { origin: "*" }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
