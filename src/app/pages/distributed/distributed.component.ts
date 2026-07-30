import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Peer } from '@models/block';
import { BlockchainService } from '@services/blockchain.service';
import { BlockComponent } from '@components/block/block.component';
import { PeerInfoComponent } from '@components/peer-info/peer-info.component';

@Component({
  selector: 'app-distributed',
  standalone: true,
  imports: [CommonModule, BlockComponent, PeerInfoComponent],
  template: `
    <h1>Blockchain Distribuida</h1>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a (click)="showExplanation = !showExplanation" style="cursor: pointer"> Explicación </a>
        </h4>
      </div>
      <div class="panel-body" *ngIf="showExplanation">
        <p>
          La blockchain se asienta sobre la descentralización de sus nodos. Cada nodo tiene su
          propia copia completa o parcial de los datos, verificando operaciones de forma autónoma.
          Así se mantiene la coherencia e integridad en todo momento.
        </p>
        <ul>
          <li>
            <a href="https://academy.bit2me.com/tipos-redes-criptomonedas/" target="_blank"
              >Bit2Me Academy - Redes de criptomonedas</a
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="col-md-10" *ngFor="let peer of peers; let i = index">
      <h3>
        {{ peer.name }}
        <peer-info *ngIf="blockchain.expertMode()" [peers]="peers" [peerIndex]="i"></peer-info>
      </h3>
      <div class="row row-horizon">
        <div class="col-md-10" *ngFor="let b of peer.blocks; let j = index">
          <block-component
            [block]="b"
            [showMineButton]="false"
            (blockChanged)="onBlockChanged(i, j, $event)"
          ></block-component>
        </div>
      </div>
    </div>
  `,
})
export class DistributedComponent implements OnInit {
  blockchain = inject(BlockchainService);

  peers: Peer[] = [];
  showExplanation = false;

  ngOnInit(): void {
    const baseBlocks = [
      {
        number: 1,
        nonce: 23344,
        data: {},
        prev: '0000000000000000000000000000000000000000000000000000000000000000',
      },
      { number: 2, nonce: 15208, data: {} },
      { number: 3, nonce: 24677, data: {} },
      { number: 4, nonce: 48313, data: {} },
      { number: 5, nonce: 45153, data: {} },
    ];

    this.peers = [
      this.blockchain.createPeer('Peer A', JSON.parse(JSON.stringify(baseBlocks))),
      this.blockchain.createPeer('Peer B', JSON.parse(JSON.stringify(baseBlocks))),
      this.blockchain.createPeer('Peer C', JSON.parse(JSON.stringify(baseBlocks))),
    ];
  }

  onBlockChanged(peerIdx: number, blockIdx: number, block: any): void {
    this.peers[peerIdx].blocks[blockIdx] = { ...block };
    for (let i = blockIdx + 1; i < this.peers[peerIdx].blocks.length; i++) {
      this.peers[peerIdx].blocks[i].header.previousBlockHash =
        this.peers[peerIdx].blocks[i - 1].hash;
      const hash = this.blockchain.hashHeader(this.peers[peerIdx].blocks[i].header);
      this.peers[peerIdx].blocks[i].hash = hash;
    }
    this.peers = [...this.peers];
  }
}
