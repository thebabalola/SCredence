import type { Payload } from '@hirosystems/chainhook-client/dist/schemas/payload';

type StacksTransaction = Payload['apply'][0]['transactions'][0];

export interface DepositEvent {
  txId: string;
  depositor: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface BorrowEvent {
  txId: string;
  borrower: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface RepaymentEvent {
  txId: string;
  borrower: string;
  amount: string;
  timestamp: number;
  blockHeight: number;
}

export interface LiquidationEvent {
  txId: string;
  liquidator: string;
  borrower: string;
  collateralAmount: string;
  debtAmount: string;
  timestamp: number;
  blockHeight: number;
}

// In-memory storage (replace with database later)
const deposits: DepositEvent[] = [];
const borrows: BorrowEvent[] = [];
const repayments: RepaymentEvent[] = [];
const liquidations: LiquidationEvent[] = [];

export async function handleDeposit(tx: StacksTransaction): Promise<void> {
  const depositor = tx.operations[0]?.account.address || 'unknown';
  
  // Extract amount from transaction operations
  const amount = extractAmountFromOps(tx.operations);
  
  const depositEvent: DepositEvent = {
    txId: tx.transaction_identifier.hash,
    depositor,
    amount,
    timestamp: Date.now(),
    blockHeight: 0 // Will be set from block context
  };
  
  deposits.push(depositEvent);
  
  console.log(`💰 Deposit processed: ${depositor} deposited ${amount} STX`);
}

export async function handleBorrow(tx: StacksTransaction): Promise<void> {
  const borrower = tx.operations[0]?.account.address || 'unknown';
  const amount = extractAmountFromOps(tx.operations);
  
  const borrowEvent: BorrowEvent = {
    txId: tx.transaction_identifier.hash,
    borrower,
    amount,
    timestamp: Date.now(),
    blockHeight: 0
  };
  
  borrows.push(borrowEvent);
  
  console.log(`📤 Borrow processed: ${borrower} borrowed ${amount} STX`);
}

export async function handleRepay(tx: StacksTransaction): Promise<void> {
  const borrower = tx.operations[0]?.account.address || 'unknown';
  const amount = extractAmountFromOps(tx.operations);
  
  const repaymentEvent: RepaymentEvent = {
    txId: tx.transaction_identifier.hash,
    borrower,
    amount,
    timestamp: Date.now(),
    blockHeight: 0
  };
  
  repayments.push(repaymentEvent);
  
  console.log(`💵 Repayment processed: ${borrower} repaid ${amount} STX`);
}

export async function handleLiquidation(tx: StacksTransaction): Promise<void> {
  const liquidator = tx.operations[0]?.account.address || 'unknown';
  
  // Extract borrower from contract call arguments
  const borrower = extractBorrowerFromArgs(tx);
  const collateralAmount = extractAmountFromOps(tx.operations);
  
  const liquidationEvent: LiquidationEvent = {
    txId: tx.transaction_identifier.hash,
    liquidator,
    borrower,
    collateralAmount,
    debtAmount: '0', // TODO: Calculate from contract state
    timestamp: Date.now(),
    blockHeight: 0
  };
  
  liquidations.push(liquidationEvent);
  
  console.log(`⚠️ Liquidation processed: ${liquidator} liquidated ${borrower}`);
}

// Helper functions
function extractAmountFromOps(operations: any[]): string {
  for (const op of operations) {
    if (op.amount?.value) {
      return op.amount.value.toString();
    }
  }
  return '0';
}

function extractBorrowerFromArgs(tx: StacksTransaction): string {
  // Extract from contract call metadata
  for (const op of tx.operations) {
    if (op.metadata?.args) {
      try {
        const args = JSON.parse(op.metadata.args);
        if (args && args.length > 0) {
          return args[0] || 'unknown';
        }
      } catch {
        // Ignore parse errors
      }
    }
  }
  return 'unknown';
}

// Export data getters
export function getAllDeposits(): DepositEvent[] {
  return [...deposits];
}

export function getAllBorrows(): BorrowEvent[] {
  return [...borrows];
}

export function getAllRepayments(): RepaymentEvent[] {
  return [...repayments];
}

export function getAllLiquidations(): LiquidationEvent[] {
  return [...liquidations];
}

export function getUserEvents(address: string) {
  return {
    deposits: deposits.filter(d => d.depositor === address),
    borrows: borrows.filter(b => b.borrower === address),
    repayments: repayments.filter(r => r.borrower === address),
    liquidations: liquidations.filter(l => l.borrower === address || l.liquidator === address)
  };
}
