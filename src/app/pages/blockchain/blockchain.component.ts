import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Block } from '@models/block';
import { BlockchainService } from '@services/blockchain.service';
import { CryptoService } from '@services/crypto.service';
import { TargetService } from '@services/target.service';
import { BlockComponent } from '@components/block/block.component';
import { ChainInfoComponent } from '@components/chain-info/chain-info.component';

@Component({
  selector: 'app-blockchain-page',
  standalone: true,
  imports: [CommonModule, BlockComponent, ChainInfoComponent],
  template: `
    <h1>
      Blockchain
      <chain-info *ngIf="blockchain.expertMode()" [blocks]="blocks"></chain-info>
    </h1>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a (click)="showExplanation = !showExplanation" style="cursor: pointer"> Explicación </a>
        </h4>
      </div>
      <div class="panel-body" *ngIf="showExplanation">
        <p>
          Una blockchain no es más que la concatenación de varios bloques de datos generados por una
          red P2P. Cada bloque se enlaza con el anterior usando su hash, creando una cadena
          inmutable.
        </p>
        <p>
          Si se altera cualquier dato de un bloque, su hash cambia, y todos los bloques posteriores
          quedan invalidados porque el <code>previousBlockHash</code>
          del siguiente bloque ya no coincide. Esta propiedad es la base de la seguridad de una
          blockchain.
        </p>
        <p>
          La validación usa <strong>Proof of Work real</strong>: el hash del bloque debe ser menor o
          igual al target definido por <code>nBits</code>.
        </p>
      </div>
    </div>

    <div class="row row-horizon">
      <div class="col-md-10" *ngFor="let b of blocks; let i = index">
        <block-component
          [block]="b"
          [showMineButton]="true"
          (blockChanged)="onBlockChanged(i, $event)"
        ></block-component>
      </div>
    </div>
  `,
})
export class BlockchainComponent implements OnInit {
  blockchain = inject(BlockchainService);
  private crypto = inject(CryptoService);
  private targetService = inject(TargetService);

  blocks: Block[] = [];
  showExplanation = false;

  ngOnInit(): void {
    const genNonces = [23344, 15208, 24677, 48313, 45153];
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

    this.blocks = genNonces.map((nonce, i) => {
      const header = {
        version: 1,
        previousBlockHash: prevHash,
        merkleRoot: this.crypto.sha256d('{}'),
        timestamp: Math.floor(Date.now() / 1000),
        nBits: this.blockchain.currentNBits(),
        nonce,
      };
      const hash = this.blockchain.hashHeader(header);
      prevHash = hash;

      return {
        header,
        transactions: [],
        hash,
        height: i + 1,
        valid: this.targetService.checkProofOfWork(hash, header.nBits),
        mined: true,
      };
    });
  }

  onBlockChanged(index: number, block: Block): void {
    this.blocks[index] = { ...block };
    for (let i = index + 1; i < this.blocks.length; i++) {
      this.blocks[i].header.previousBlockHash = this.blocks[i - 1].hash;
      const hash = this.blockchain.hashHeader(this.blocks[i].header);
      this.blocks[i].hash = hash;
      this.blocks[i].valid = this.targetService.checkProofOfWork(hash, this.blocks[i].header.nBits);
    }
    this.blocks = [...this.blocks];
  }
}
