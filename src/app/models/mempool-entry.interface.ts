import type { Transaction } from './transaction.interface';

export interface MempoolEntry {
  transaction: Transaction;
  feeRate: number;
  size: number;
  timestamp: number;
}
