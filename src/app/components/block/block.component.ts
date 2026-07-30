import type { OnChanges, SimpleChanges } from '@angular/core';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Block } from '@models/block';
import { CryptoService } from '@services/crypto.service';
import { TargetService } from '@services/target.service';
import { BlockchainService } from '@services/blockchain.service';

@Component({
  selector: 'block-component',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './block.component.html',
})
export class BlockComponent implements OnChanges {
  @Input() block!: Block;
  @Input() showMineButton = true;
  @Input() simpleMode = false;
  @Output() blockChanged = new EventEmitter<Block>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly crypto = inject(CryptoService);
  private readonly targetService = inject(TargetService);
  private readonly blockchain = inject(BlockchainService);

  dataString = '';
  showData = false;
  mining = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['block'] && this.block && !this.dataString) {
      this.dataString = JSON.stringify(
        this.block.transactions.map((t) => ({
          txid: t.txid,
          inputs: t.inputs.map((i) => ({
            prevTx: i.previousTxHash.substring(0, 12) + '...',
            index: i.outputIndex,
          })),
          outputs: t.outputs.map((o) => ({
            value: o.value,
            address: o.address,
          })),
        })),
        null,
        2,
      );
    }
  }

  updateBlock(): void {
    const txids = this.block.transactions.map((t) => t.txid);
    this.block.header.merkleRoot = this.crypto.computeMerkleRoot(txids);
    this.block.hash = this.blockchain.hashHeader(this.block.header);
    this.block.valid = this.targetService.checkProofOfWork(
      this.block.hash,
      this.block.header.nBits,
    );

    if (!this.block.valid) {
      this.block.mined = false;
    }

    this.blockChanged.emit(this.block);
  }

  async mine(): Promise<void> {
    this.mining = true;
    this.cdr.markForCheck();

    await this.blockchain.mineBlockAsync(this.block);

    this.mining = false;
    this.blockChanged.emit(this.block);
  }

  getDifficultyPrefix(): string {
    return this.blockchain.difficultyPrefix();
  }

  onDataChange(value: string): void {
    this.dataString = value;
    try {
      const parsed = JSON.parse(value);
      this.block.transactions = parsed;
    } catch {
      /* ignore parse errors */
    }
    this.updateBlock();
  }

  get expertMode(): boolean {
    return this.blockchain.expertMode();
  }
}
