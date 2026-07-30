import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '@services/crypto.service';

@Component({
  selector: 'app-hash',
  imports: [FormsModule],
  template: `
    <h1>Función Hash SHA-256</h1>

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
            Una
            <a href="https://academy.bit2me.com/que-es-hash/" target="_blank">función hash</a>
            es una función criptográfica que permite tomar información y calcular una cadena
            alfanumérica única, irrepetible y de tamaño fijo que representa los datos ingresados.
            Básicamente toma grandes cantidades de información y las transforma en un dato mucho más
            pequeño, manejable y verificable.
          </p>
          <p>
            Al ser <strong>determinista</strong>, para una misma entrada siempre obtendrás el mismo
            hash. La más usada en criptomonedas es SHA-256, estándar de la industria y la usada por
            Bitcoin.
          </p>
          <strong>Ejemplos</strong>
          <p>
            Escribe "¡Hola mundo!" y verás el hash SHA-256:
            <code>be95feded82029acd290e2f9bf3e0dd8e21922c9ce045120ed4e0cff0ae69063</code>. No
            importa cuántas veces lo escribas, siempre obtendrás el mismo hash. ¡Pruébalo!
          </p>
        </div>
      }
    </div>

    <div class="well p-3">
      <div class="mb-3">
        <label class="form-label fw-bold">Entrada:</label>
        <textarea
          rows="8"
          class="form-control"
          [(ngModel)]="data"
          (ngModelChange)="hash = cryptoService.sha256(data)"
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label fw-bold">Hash SHA-256:</label>
        <input class="form-control" [value]="hash" readonly />
      </div>
      @if (data) {
        <div>
          <label class="form-label fw-bold">Double SHA-256 (SHA256d):</label>
          <input class="form-control" [value]="cryptoService.sha256d(data)" readonly />
        </div>
      }
    </div>
  `,
})
export class HashComponent {
  readonly cryptoService = inject(CryptoService);
  data = '';
  hash = this.cryptoService.sha256('');
  showExplanation = false;
}
