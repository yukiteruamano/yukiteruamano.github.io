import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { BlockchainService } from '@services/blockchain.service';
import type { UTXO } from '@models/block';

@Component({
  selector: 'utxo-set',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (utxos.length > 0) {
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="panel-title">UTXO Set ({{ utxos.length }} outputs sin gastar)</h4>
        </div>
        <div class="panel-body">
          <table
            class="table table-sm table-striped"
            style="font-family: monospace; font-size: 12px"
          >
            <thead>
              <tr>
                <th>TxID</th>
                <th>Index</th>
                <th>Dirección</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              @for (utxo of utxos; track utxo.txid + '_' + utxo.outputIndex) {
                <tr>
                  <td>{{ utxo.txid.substring(0, 10) }}...</td>
                  <td>{{ utxo.outputIndex }}</td>
                  <td>{{ utxo.address.substring(0, 10) }}...</td>
                  <td>{{ utxo.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
})
export class UtxoSetComponent {
  private readonly blockchain = inject(BlockchainService);

  get utxos(): UTXO[] {
    return this.blockchain.utxoSet();
  }
}
