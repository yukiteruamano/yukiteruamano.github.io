import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlockchainService } from '@services/blockchain.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly blockchain = inject(BlockchainService);

  onNBitsChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nBits = parseInt(select.value, 10);
    if (!isNaN(nBits)) {
      this.blockchain.setNBits(nBits);
    }
  }
}
