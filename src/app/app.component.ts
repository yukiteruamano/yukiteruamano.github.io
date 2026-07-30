import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  readonly blockchain = inject(BlockchainService);
  darkMode = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    if (saved) {
      this.darkMode = saved === 'dark';
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }

  onNBitsChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const nBits = parseInt(select.value, 10);
    if (!isNaN(nBits)) {
      this.blockchain.setNBits(nBits);
    }
  }
}
