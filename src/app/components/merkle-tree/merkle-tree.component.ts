import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CryptoService } from '@services/crypto.service';

@Component({
  selector: 'merkle-tree',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (levels.length > 0) {
      <div class="merkle-tree" role="region" aria-label="Árbol de Merkle">
        <h4 class="text-center mb-3">Árbol de Merkle</h4>
        @for (level of levels; track $index; let i = $index) {
          <div class="merkle-row">
            <div class="merkle-level-label">
              {{
                i === levels.length - 1
                  ? 'Raíz'
                  : i === 0
                    ? 'Hojas (TxID)'
                    : 'Nivel ' + (levels.length - i - 1)
              }}
            </div>
            <div class="merkle-nodes">
              @for (node of level; track node + $index) {
                <div
                  class="merkle-node"
                  [class.merkle-root]="i === levels.length - 1"
                  [class.merkle-leaf]="i === 0"
                  [attr.title]="node"
                >
                  <div class="merkle-hash">
                    {{ node.substring(0, 8) }}...{{ node.substring(56) }}
                  </div>
                  @if (i < levels.length - 1) {
                    <div class="merkle-connector">
                      <div class="merkle-line-left"></div>
                      <div class="merkle-line-right"></div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: `
    .merkle-tree {
      margin: 20px 0;
      padding: 20px;
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow-x: auto;
      transition:
        background 0.3s,
        border-color 0.3s;
    }

    .merkle-row {
      margin-bottom: 16px;
    }

    .merkle-level-label {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: 4px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .merkle-nodes {
      display: flex;
      justify-content: center;
      gap: 4px;
      flex-wrap: nowrap;
    }

    .merkle-node {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
    }

    .merkle-hash {
      font-family: monospace;
      font-size: 11px;
      background: var(--color-input-bg);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      padding: 4px 8px;
      color: var(--color-input-text);
      white-space: nowrap;
      transition:
        background 0.3s,
        border-color 0.3s;
    }

    .merkle-root .merkle-hash {
      background: var(--color-accent);
      color: #fff;
      font-weight: 700;
      border-color: var(--color-accent);
      font-size: 12px;
      padding: 6px 10px;
    }

    .merkle-leaf .merkle-hash {
      border-color: var(--color-accent);
      border-left: 3px solid var(--color-accent);
    }

    .merkle-node:hover .merkle-hash {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition:
        transform 0.15s,
        box-shadow 0.15s;
    }

    .merkle-connector {
      display: flex;
      justify-content: center;
      height: 12px;
      position: relative;
    }

    .merkle-line-left,
    .merkle-line-right {
      width: 50%;
      height: 100%;
      border-top: 1px solid var(--color-border);
    }

    .merkle-line-left {
      border-right: 1px solid var(--color-border);
    }
  `,
})
export class MerkleTreeComponent {
  private readonly crypto = inject(CryptoService);

  @Input({ required: true }) set txids(value: string[]) {
    if (value && value.length > 0) {
      this.levels = this.crypto.buildMerkleTree(value);
    } else {
      this.levels = [];
    }
  }

  levels: string[][] = [];
}
