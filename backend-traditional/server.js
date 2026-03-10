const express = require('express');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const { startWorker } = require('./worker');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

startWorker();
const io = new Server(server, {
  cors: { origin: "*" }
});

const prisma = require('./utils/prisma');

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/ticketRoutes'));

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
