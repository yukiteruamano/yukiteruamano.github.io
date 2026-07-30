import { Injectable, signal } from '@angular/core';
import type { Transaction, MempoolEntry } from '@models/block';

@Injectable({ providedIn: 'root' })
export class MempoolService {
  readonly pending = signal<MempoolEntry[]>([]);

  addTransaction(tx: Transaction, size: number = 250): void {
    const fee = tx.fee || 0;
    const feeRate = size > 0 ? fee / size : 0;

    const entry: MempoolEntry = {
      transaction: tx,
      feeRate,
      size,
      timestamp: Date.now(),
    };

    this.pending.update((p) => [...p, entry].sort((a, b) => b.feeRate - a.feeRate));
  }

  removeTransactions(txids: string[]): void {
    this.pending.update((p) => p.filter((entry) => !txids.includes(entry.transaction.txid)));
  }

  selectForBlock(maxSize: number = 1000000): Transaction[] {
    const selected: Transaction[] = [];
    let totalSize = 0;

    for (const entry of this.pending()) {
      if (totalSize + entry.size <= maxSize) {
        selected.push(entry.transaction);
        totalSize += entry.size;
      }
    }

    return selected;
  }

  getPendingCount(): number {
    return this.pending().length;
  }

  clear(): void {
    this.pending.set([]);
  }

  getTxById(txid: string): MempoolEntry | undefined {
    return this.pending().find((e) => e.transaction.txid === txid);
  }
}
