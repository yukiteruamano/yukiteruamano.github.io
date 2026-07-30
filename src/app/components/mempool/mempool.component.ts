import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { MempoolEntry } from '@models/block';
import { MempoolService } from '@services/mempool.service';

@Component({
  selector: 'mempool',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mempool.component.html',
})
export class MempoolComponent {
  private readonly mempool = inject(MempoolService);

  @Output() selectForBlock = new EventEmitter<string[]>();

  get entries(): MempoolEntry[] {
    return this.mempool.pending();
  }

  get count(): number {
    return this.mempool.getPendingCount();
  }

  mineSelected(): void {
    const selectedTxs = this.mempool.selectForBlock();
    this.selectForBlock.emit(selectedTxs.map((tx) => tx.txid));
  }
}
