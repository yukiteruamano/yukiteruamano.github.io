import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Peer, Block } from '@models/block';
import { BlockchainService } from '@services/blockchain.service';
import { BlockComponent } from '@components/block/block.component';
import { PeerInfoComponent } from '@components/peer-info/peer-info.component';
import { ZERO_HASH } from '@app/constants';

@Component({
  selector: 'app-tokens',
  imports: [BlockComponent, PeerInfoComponent],
  template: `
    <h1>Tokens</h1>

    <div class="panel">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a
            (click)="showExplanation = !showExplanation"
            role="button"
            [attr.aria-expanded]="showExplanation"
          >
            Explicación
          </a>
        </h4>
      </div>
      @if (showExplanation) {
        <div class="panel-body">
          <p>
            Los tokens son objetos similares a las monedas pero carecen de curso legal. Son emitidos
            por entidades privadas para usos determinados. Son una de las creaciones más esenciales
            de la tecnología blockchain, abriendo puertas a aplicaciones que aún estamos por
            descubrir.
          </p>
          <h3>Modelo UTXO + Firmas ECDSA</h3>
          <p>
            En esta versión mejorada, las transacciones usan el modelo UTXO real: cada transacción
            consume outputs existentes y crea nuevos, protegidos con firmas digitales ECDSA y
            direcciones P2PKH reales.
          </p>
          <ul>
            <li>
              <a href="https://academy.bit2me.com/que-es-un-token" target="_blank"
                >Bit2Me Academy - ¿Qué es un token?</a
              >
            </li>
          </ul>
        </div>
      }
    </div>

    @for (peer of peers; track peer.name; let i = $index) {
      <div class="mb-5">
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
export class TokensComponent implements OnInit {
  readonly blockchain = inject(BlockchainService);

  peers: Peer[] = [];
  showExplanation = false;

  ngOnInit(): void {
    const baseBlocks = [
      {
        number: 1,
        nonce: 30002,
        data: {
          txs: [
            { value: 200, from: 'Ali', to: 'Oli' },
            { value: 10, from: 'Ali', to: 'Robin' },
          ],
        },
        prev: ZERO_HASH,
      },
      { number: 2, nonce: 54232, data: { txs: [{ value: 10, from: 'Oli', to: 'Robin' }] } },
      { number: 3, nonce: 54657, data: { txs: [{ value: 5, from: 'Robin', to: 'Lara' }] } },
      {
        number: 4,
        nonce: 975,
        data: {
          txs: [
            { value: 20, from: 'Oli', to: 'Ali' },
            { value: 5, from: 'Oli', to: 'Lara' },
          ],
        },
      },
      { number: 5, nonce: 7113, data: { txs: [] } },
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
