import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import type { Block } from '@models/block';
import { GENESIS_NBITS } from '@app/constants';

@Component({
  selector: 'chain-info',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    (height: {{ blocks.length }} blocks, valid: {{ allValid }}, accumulated work:
    {{ workAccumulated | number }})
  `,
})
export class ChainInfoComponent {
  @Input() blocks: Block[] = [];

  get allValid(): boolean {
    return this.blocks.length > 0 && this.blocks.every((b) => b.valid);
  }

  get workAccumulated(): number {
    return this.blocks.reduce((sum, b) => {
      const nBits = b.header?.nBits || GENESIS_NBITS;
      const target = BigInt(
        '0x' +
          ((nBits & 0xffffff) * Math.pow(2, 8 * (((nBits >> 24) & 0xff) - 3)))
            .toString(16)
            .padStart(64, '0'),
      );
      return sum + Number(BigInt(2) ** BigInt(256)) / (Number(target) || 1);
    }, 0);
  }
}
