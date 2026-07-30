import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-intro',
  imports: [RouterLink],
  template: `
    <h1>Simulador Blockchain</h1>

    <p>Bienvenidos al Simulador de Blockchain de Bit2Me.</p>
    <p>
      Este simulador ha sido creado con el fin de explicar de forma gráfica y sencilla el
      funcionamiento de una blockchain y sus distintas partes. Básicamente te permite comprender
      cómo se generan los bloques, el papel que juegan las primitivas criptográficas y de consenso,
      así como entender cómo se protege una blockchain frente a cambios no deseados por parte de
      actores maliciosos.
    </p>
    <p>
      El simulador está basado en el trabajo de
      <a href="https://github.com/anders94" target="_blank">Anders Brownworth</a>, actualizado con
      Angular 18, firma digital ECDSA, modelo UTXO, Merkle Trees y otras características realistas
      de blockchain.
    </p>

    <h3>Funciones del simulador</h3>
    <ul>
      <li><a routerLink="/hash">Hash</a> — Función hash SHA-256 interactiva</li>
      <li><a routerLink="/block">Block</a> — Estructura de un bloque con minería PoW</li>
      <li><a routerLink="/blockchain">Blockchain</a> — Cadena de bloques enlazados</li>
      <li><a routerLink="/distributed">Distribuido</a> — Red P2P con múltiples peers</li>
      <li><a routerLink="/tokens">Tokens</a> — Transacciones con tokens</li>
      <li><a routerLink="/coinbase">Coinbase</a> — Transacciones coinbase y recompensas</li>
    </ul>

    <img
      src="https://academy.bit2me.com/wp-content/uploads/2020/08/seguridad-blockchain-mitos-bit2me-academy.png"
      alt="Simulador Blockchain — Seguridad blockchain"
      class="mt-4"
      loading="lazy"
      width="800"
      height="400"
    />
  `,
})
export class IntroComponent {}
