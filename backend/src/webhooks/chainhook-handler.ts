import type { Payload } from '@hirosystems/chainhook-client/dist/schemas/payload';
import express from 'express';
import {
  handleDeposit,
  handleBorrow,
  handleRepay,
  handleLiquidation
} from '../services/lending-events';

const router = express.Router();

// Webhook endpoint for Chainhook events
router.post('/events', async (req, res) => {
  try {
    const payload: Payload = req.body;
    
    console.log('📨 Received Chainhook event:', {
      applyBlocks: payload.apply.length,
      rollback: payload.rollback.length
    });
    
    // Process the event
    await processLendingEvent(payload);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Chainhook event processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

async function processLendingEvent(payload: Payload) {
  // Extract transactions from the event
  for (const block of payload.apply) {
    console.log(`📦 Processing block ${block.block_identifier.index}`);
    
    for (const tx of block.transactions) {
      // Check for contract calls to lending-pool
      for (const op of tx.operations) {
        if (op.metadata?.method_name) {
          const functionName = op.metadata.method_name;
          
          console.log(`🔧 Contract call: ${functionName} by ${op.account.address}`);
          
          switch (functionName) {
            case 'deposit-stx':
              await handleDeposit(tx);
              break;
            case 'borrow-stx':
              await handleBorrow(tx);
              break;
            case 'repay':
              await handleRepay(tx);
              break;
            case 'liquidate':
              await handleLiquidation(tx);
              break;
          }
        }
      }
    }
  }
}

export default router;
