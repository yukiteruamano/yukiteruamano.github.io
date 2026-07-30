import type { OnChanges } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import type { Peer, Block } from '@models/block';

@Component({
  selector: 'peer-info',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    (height: {{ blocks.length }} blocks, valid: {{ allValid }}, consensus: {{ consensus }} other
    peers, last block hash: {{ lastBlockHash }})
  `,
})
export class PeerInfoComponent implements OnChanges {
  @Input() peers: Peer[] = [];
  @Input() peerIndex = 0;

  blocks: Block[] = [];
  allValid = false;
  lastBlockHash = '';
  consensus = 0;

  ngOnChanges(): void {
    this.updateView();
  }

  private updateView(): void {
    if (
      !this.peers ||
      !this.peers[this.peerIndex] ||
      !this.peers[this.peerIndex].blocks ||
      !this.peers[this.peerIndex].blocks[0]?.hash
    ) {
      return;
    }

    this.blocks = this.peers[this.peerIndex].blocks;
    this.allValid = this.blocks.every((b) => b.valid);
    this.lastBlockHash = this.blocks[this.blocks.length - 1].hash;

    this.consensus = 0;
    this.peers.forEach((peer, index) => {
      if (
        index !== this.peerIndex &&
        peer.blocks.length > 0 &&
        peer.blocks[peer.blocks.length - 1].hash === this.lastBlockHash
      ) {
        this.consensus++;
      }
    });
  }
}
