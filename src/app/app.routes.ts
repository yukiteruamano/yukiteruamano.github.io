import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/intro/intro.component').then((m) => m.IntroComponent),
  },
  {
    path: 'hash',
    loadComponent: () => import('@pages/hash/hash.component').then((m) => m.HashComponent),
  },
  {
    path: 'block',
    loadComponent: () => import('@pages/block/block.component').then((m) => m.BlockPageComponent),
  },
  {
    path: 'blockchain',
    loadComponent: () =>
      import('@pages/blockchain/blockchain.component').then((m) => m.BlockchainComponent),
  },
  {
    path: 'distributed',
    loadComponent: () =>
      import('@pages/distributed/distributed.component').then((m) => m.DistributedComponent),
  },
  {
    path: 'tokens',
    loadComponent: () => import('@pages/tokens/tokens.component').then((m) => m.TokensComponent),
  },
  {
    path: 'coinbase',
    loadComponent: () =>
      import('@pages/coinbase/coinbase.component').then((m) => m.CoinbaseComponent),
  },
  { path: '**', redirectTo: '' },
];
