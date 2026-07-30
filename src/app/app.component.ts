import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockchainService } from '@services/blockchain.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  blockchain = inject(BlockchainService);

  get expertMode(): boolean {
    return this.blockchain.expertMode();
  }

  get difficulty(): number {
    return this.blockchain.difficulty();
  }

  get nBits(): number {
    return this.blockchain.currentNBits();
  }

  toggleExpertMode(): void {
    this.blockchain.toggleExpertMode();
  }

  onDifficultyChange(value: number): void {
    this.blockchain.setDifficulty(value);
  }

  onNBitsChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nBits = parseInt(select.value, 10);
    if (!isNaN(nBits)) {
      this.blockchain.setNBits(nBits);
    }
  }
}
