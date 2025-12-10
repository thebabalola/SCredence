import {
  getAllDeposits,
  getAllBorrows,
  getAllRepayments,
  getAllLiquidations
} from './lending-events';

export interface ProtocolAnalytics {
  tvl: string;
  totalDeposits: string;
  totalBorrows: string;
  utilizationRate: number;
  totalRepayments: string;
  totalLiquidations: number;
  activeUsers: number;
}

export function calculateTVL(): string {
  const deposits = getAllDeposits();
  const borrows = getAllBorrows();
  const repayments = getAllRepayments();
  
  let totalDeposited = BigInt(0);
  let totalBorrowed = BigInt(0);
  let totalRepaid = BigInt(0);
  
  deposits.forEach(d => {
    totalDeposited += BigInt(d.amount);
  });
  
  borrows.forEach(b => {
    totalBorrowed += BigInt(b.amount);
  });
  
  repayments.forEach(r => {
    totalRepaid += BigInt(r.amount);
  });
  
  // TVL = Total Deposits - (Total Borrowed - Total Repaid)
  const tvl = totalDeposited - (totalBorrowed - totalRepaid);
  
  return tvl.toString();
}

export function calculateUtilizationRate(): number {
  const deposits = getAllDeposits();
  const borrows = getAllBorrows();
  const repayments = getAllRepayments();
  
  let totalDeposited = BigInt(0);
  let totalBorrowed = BigInt(0);
  let totalRepaid = BigInt(0);
  
  deposits.forEach(d => totalDeposited += BigInt(d.amount));
  borrows.forEach(b => totalBorrowed += BigInt(b.amount));
  repayments.forEach(r => totalRepaid += BigInt(r.amount));
  
  const outstandingBorrows = totalBorrowed - totalRepaid;
  
  if (totalDeposited === BigInt(0)) return 0;
  
  // Utilization = Outstanding Borrows / Total Deposits * 100
  const utilization = Number(outstandingBorrows * BigInt(10000) / totalDeposited) / 100;
  
  return utilization;
}

export function getProtocolAnalytics(): ProtocolAnalytics {
  const deposits = getAllDeposits();
  const borrows = getAllBorrows();
  const repayments = getAllRepayments();
  const liquidations = getAllLiquidations();
  
  let totalDeposited = BigInt(0);
  let totalBorrowed = BigInt(0);
  let totalRepaid = BigInt(0);
  
  deposits.forEach(d => totalDeposited += BigInt(d.amount));
  borrows.forEach(b => totalBorrowed += BigInt(b.amount));
  repayments.forEach(r => totalRepaid += BigInt(r.amount));
  
  // Get unique users
  const uniqueUsers = new Set<string>();
  deposits.forEach(d => uniqueUsers.add(d.depositor));
  borrows.forEach(b => uniqueUsers.add(b.borrower));
  
  return {
    tvl: calculateTVL(),
    totalDeposits: totalDeposited.toString(),
    totalBorrows: totalBorrowed.toString(),
    utilizationRate: calculateUtilizationRate(),
    totalRepayments: totalRepaid.toString(),
    totalLiquidations: liquidations.length,
    activeUsers: uniqueUsers.size
  };
}

export function getUserAnalytics(address: string) {
  const deposits = getAllDeposits().filter(d => d.depositor === address);
  const borrows = getAllBorrows().filter(b => b.borrower === address);
  const repayments = getAllRepayments().filter(r => r.borrower === address);
  
  let totalDeposited = BigInt(0);
  let totalBorrowed = BigInt(0);
  let totalRepaid = BigInt(0);
  
  deposits.forEach(d => totalDeposited += BigInt(d.amount));
  borrows.forEach(b => totalBorrowed += BigInt(b.amount));
  repayments.forEach(r => totalRepaid += BigInt(r.amount));
  
  const outstandingDebt = totalBorrowed - totalRepaid;
  
  return {
    address,
    totalDeposited: totalDeposited.toString(),
    totalBorrowed: totalBorrowed.toString(),
    totalRepaid: totalRepaid.toString(),
    outstandingDebt: outstandingDebt.toString(),
    depositCount: deposits.length,
    borrowCount: borrows.length,
    repaymentCount: repayments.length
  };
}
