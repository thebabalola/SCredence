import { ChainhookEvent } from '@hirosystems/chainhooks-client';
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
    const event: ChainhookEvent = req.body;
    
    console.log('📨 Received Chainhook event:', {
      chainhook: event.chainhook.name,
      chain: event.event.chain,
      network: event.event.network,
      applyBlocks: event.event.apply.length,
      rollbackBlocks: event.event.rollback.length
    });
    
    // Process the event
    await processLendingEvent(event);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Chainhook event processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

async function processLendingEvent(event: ChainhookEvent) {
  // Extract transactions from the event
  for (const block of event.event.apply) {
    console.log(`📦 Processing block ${block.block_identifier.index}`);
    
    for (const tx of block.transactions) {
      // Check for contract calls to lending-pool
      for (const op of tx.operations) {
        if (op.type === 'contract_call' && 
            op.metadata.contract_identifier.includes('lending-pool')) {
          
          const functionName = op.metadata.function_name;
          
          console.log(`🔧 Contract call: ${functionName} by ${tx.metadata.sender_address}`);
          
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
