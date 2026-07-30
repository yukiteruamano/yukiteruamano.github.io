import type { Transaction } from './transaction.interface';
import type { BlockHeader } from './block-header.interface';

export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
  hash: string;
  height: number;
  valid: boolean;
  mined: boolean;
  miningStats?: string;
}
