import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Peer, Block } from '@models/block';
import { BlockchainService } from '@services/blockchain.service';
import { BlockComponent } from '@components/block/block.component';
import { PeerInfoComponent } from '@components/peer-info/peer-info.component';
import { ZERO_HASH } from '@app/constants';

@Component({
  selector: 'app-coinbase',
  imports: [BlockComponent, PeerInfoComponent],
  template: `
    <h1>Transacción Coinbase</h1>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a (click)="showExplanation = !showExplanation" style="cursor: pointer"> Explicación </a>
        </h4>
      </div>
      @if (showExplanation) {
        <div class="panel-body">
          <p>
            Una transacción coinbase es una transacción especial creada por los mineros que les
            permite obtener la recompensa de bloque (block reward) más las comisiones de las
            transacciones incluidas.
          </p>
          <p>
            Es siempre la primera transacción de un bloque y tiene un input especial:
            <code>prevTxHash = 0x0</code>, <code>outputIndex = 0xFFFFFFFF</code>, y su
            <code>scriptSig</code> contiene la altura del bloque y datos arbitrarios (como el famoso
            mensaje de Satoshi en el bloque génesis).
          </p>
          <p>
            La recompensa de bloque sigue un esquema de <strong>halving</strong>: se reduce a la
            mitad cada 210,000 bloques (~4 años). Empezó en 50 BTC y actualmente está en 3.125 BTC.
          </p>
          <ul>
            <li>
              <a href="https://academy.bit2me.com/que-es-coinbase-transaccion/" target="_blank"
                >Bit2Me Academy - Transacción Coinbase</a
              >
            </li>
          </ul>
        </div>
      }
    </div>

    @for (peer of peers; track peer.name; let i = $index) {
      <div>
        <h3>
          {{ peer.name }}
          @if (blockchain.expertMode()) {
            <peer-info [peers]="peers" [peerIndex]="i"></peer-info>
          }
        </h3>
        <div class="row row-horizon">
          @for (b of peer.blocks; track b.hash; let j = $index) {
            <div class="col-md-10">
              <block-component
                [block]="b"
                [showMineButton]="false"
                (blockChanged)="onBlockChanged(i, j, $event)"
              ></block-component>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class CoinbaseComponent implements OnInit {
  readonly blockchain = inject(BlockchainService);

  peers: Peer[] = [];
  showExplanation = false;

  ngOnInit(): void {
    const baseBlocks = [
      {
        number: 1,
        nonce: 114530,
        data: { coinbase: { value: 100, to: 'Oli' }, txs: [] },
        prev: ZERO_HASH,
      },
      {
        number: 2,
        nonce: 110437,
        data: {
          coinbase: { value: 100, to: 'Oli' },
          txs: [{ value: 10, from: 'Oli', to: 'Robin' }],
        },
      },
      { number: 3, nonce: 70198, data: { txs: [{ value: 5, from: 'Robin', to: 'Lara' }] } },
      {
        number: 4,
        nonce: 13951,
        data: {
          txs: [
            { value: 20, from: 'Oli', to: 'Ali' },
            { value: 5, from: 'Oli', to: 'Lara' },
          ],
        },
      },
      { number: 5, nonce: 25442, data: { txs: [{ value: 65, from: 'Oli', to: 'Ali' }] } },
    ];

    this.peers = [
      this.blockchain.createPeer('Peer A', JSON.parse(JSON.stringify(baseBlocks))),
      this.blockchain.createPeer('Peer B', JSON.parse(JSON.stringify(baseBlocks))),
      this.blockchain.createPeer('Peer C', JSON.parse(JSON.stringify(baseBlocks))),
    ];
  }

  onBlockChanged(peerIdx: number, blockIdx: number, block: Block): void {
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
