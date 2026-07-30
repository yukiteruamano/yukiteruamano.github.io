import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Block, BlockHeader } from '@models/block';
import { BlockchainService } from '@services/blockchain.service';
import { CryptoService } from '@services/crypto.service';
import { BlockComponent } from '@components/block/block.component';
import type { KeyPair } from '@models/block';

@Component({
  selector: 'app-block-page',
  standalone: true,
  imports: [FormsModule, BlockComponent],
  template: `
    <h1>Bloque</h1>

    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a (click)="showExplanation = !showExplanation" style="cursor: pointer"> Explicación </a>
        </h4>
      </div>
      @if (showExplanation) {
        <div class="panel-body">
          <p>Un bloque es la unidad donde se ordenan los datos dentro de una blockchain.</p>
          <p>En su interior contiene:</p>
          <ul>
            <li><strong>Versión:</strong> Versión del formato del bloque.</li>
            <li>
              <strong>Hash del bloque anterior:</strong> Enlaza el bloque con el anterior en la
              cadena. Si el hash de un bloque previo cambia, toda la cadena posterior se invalida.
            </li>
            <li>
              <strong>Merkle Root:</strong> Raíz del árbol de Merkle construido con todas las
              transacciones del bloque. Permite verificar eficientemente la integridad de los datos.
            </li>
            <li><strong>Timestamp:</strong> Marca de tiempo UNIX del bloque.</li>
            <li>
              <strong>nBits (Target):</strong> Representación compacta del target de dificultad.
              Define cuán difícil es encontrar un hash válido.
            </li>
            <li>
              <strong>Nonce:</strong> Número que los mineros iteran para encontrar un hash que
              cumpla con el target.
            </li>
          </ul>
          <h3>Minería (Proof of Work)</h3>
          <p>
            El hash del bloque debe ser menor o igual al target definido por nBits. Los mineros
            prueban distintos nonces hasta encontrar uno que cumpla esta condición:
            <code
              >SHA256d(version + prevHash + merkleRoot + timestamp + nBits + nonce) &lt;=
              target</code
            >.
          </p>
          <h3>Enlaces:</h3>
          <ul>
            <li>
              <a
                href="https://academy.bit2me.com/que-es-un-bloque-dentro-de-la-blockchain/"
                target="_blank"
                >Bit2Me Academy - ¿Qué es un bloque?</a
              >
            </li>
            <li>
              <a
                href="https://academy.bit2me.com/mineria-bitcoin-como-se-crea-un-bloque/"
                target="_blank"
                >Bit2Me Academy - Minería Bitcoin</a
              >
            </li>
          </ul>
        </div>
      }
    </div>

    <div class="mb-3">
      <button class="btn btn-sm" style="background: #02264a; color: #fff" (click)="generateKey()">
        Generar par de claves ECDSA
      </button>
      @if (keyPair) {
        <div class="mt-2 p-2" style="background: #f5f5f5; font-family: monospace; font-size: 12px">
          <div><strong>Clave privada:</strong> {{ keyPair.privateKey.substring(0, 32) }}...</div>
          <div><strong>Clave pública:</strong> {{ keyPair.publicKey.substring(0, 32) }}...</div>
          <div><strong>Dirección P2PKH:</strong> {{ keyPair.address }}</div>
        </div>
      }
    </div>

    <block-component
      [block]="block"
      [showMineButton]="true"
      (blockChanged)="onBlockChanged($event)"
    ></block-component>
  `,
})
export class BlockPageComponent implements OnInit {
  private blockchain = inject(BlockchainService);
  private crypto = inject(CryptoService);

  block!: Block;
  keyPair: KeyPair | null = null;
  showExplanation = false;

  ngOnInit(): void {
    this.initBlock();
  }

  initBlock(): void {
    const header: BlockHeader = {
      version: 1,
      previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: this.crypto.sha256d(''),
      timestamp: Math.floor(Date.now() / 1000),
      nBits: this.blockchain.currentNBits(),
      nonce: 1,
    };

    this.block = {
      header,
      transactions: [],
      hash: this.blockchain.hashHeader(header),
      height: 1,
      valid: false,
      mined: false,
    };
  }

  generateKey(): void {
    this.keyPair = this.crypto.generateKeyPair();
  }

  onBlockChanged(block: Block): void {
    this.block = block;
  }
}
