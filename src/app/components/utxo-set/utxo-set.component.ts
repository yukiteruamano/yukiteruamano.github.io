import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockchainService } from '@services/blockchain.service';
import type { UTXO } from '@models/block';

@Component({
  selector: 'utxo-set',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel panel-default" *ngIf="utxos.length > 0">
      <div class="panel-heading">
        <h4 class="panel-title">UTXO Set ({{ utxos.length }} outputs sin gastar)</h4>
      </div>
      <div class="panel-body">
        <table class="table table-sm table-striped" style="font-family: monospace; font-size: 12px">
          <thead>
            <tr>
              <th>TxID</th>
              <th>Index</th>
              <th>Dirección</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let utxo of utxos">
              <td>{{ utxo.txid.substring(0, 10) }}...</td>
              <td>{{ utxo.outputIndex }}</td>
              <td>{{ utxo.address.substring(0, 10) }}...</td>
              <td>{{ utxo.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UtxoSetComponent {
  private blockchain = inject(BlockchainService);

  get utxos(): UTXO[] {
    return this.blockchain.utxoSet();
  }
}
