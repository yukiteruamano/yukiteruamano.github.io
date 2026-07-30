import type { Block } from './block.interface';
import type { UTXO } from './utxo.interface';
import type { Transaction } from './transaction.interface';

export interface Peer {
  name: string;
  blocks: Block[];
  utxoSet: UTXO[];
  mempool: Transaction[];
}
