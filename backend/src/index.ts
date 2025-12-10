import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chainhookRouter from './webhooks/chainhook-handler';
import apiRouter from './api/routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/chainhook', chainhookRouter);
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StacksLend Backend running on port ${PORT}`);
  console.log(`📡 Chainhook webhook: http://localhost:${PORT}/chainhook/events`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
});
