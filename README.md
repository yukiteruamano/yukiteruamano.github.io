# Simulador Blockchain

[![CI](https://github.com/yukiteruamano/yukiteruamano.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/yukiteruamano/yukiteruamano.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/yukiteruamano/yukiteruamano.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/yukiteruamano/yukiteruamano.github.io/actions/workflows/deploy.yml)
[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Simulador educativo de Blockchain con **Angular 19**, firma digital **ECDSA** (secp256k1), modelo **UTXO**, Merkle Trees y Proof of Work real.

Basado en el trabajo de [Anders Brownworth](https://github.com/anders94).

---

## Usar el simulador

El simulador está disponible en:

### **[yukiteruamano.github.io](https://yukiteruamano.github.io)**

Navega entre las secciones del menú para explorar cada concepto:

| Sección | Concepto |
|---|---|
| **Hash** | Función hash SHA-256 interactiva |
| **Block** | Estructura de un bloque con minería PoW |
| **Blockchain** | Cadena de bloques enlazados |
| **Distribuido** | Red P2P con múltiples peers |
| **Tokens** | Transacciones con modelo UTXO |
| **Coinbase** | Transacciones coinbase y recompensas |

---

## Desarrollo

### Requisitos

- [Node.js](https://nodejs.org/) 20 (usa `nvm use` si tienes nvm)
- npm 10+

### Instalación

```bash
git clone git@github.com:yukiteruamano/yukiteruamano.github.io.git
cd yukiteruamano.github.io
npm ci
```

### Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Servidor de desarrollo (http://localhost:4200) |
| `npm run build` | Build de producción → `docs/` |
| `npm test` | Tests unitarios (Karma + Jasmine) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

### Arquitectura

```
src/app/
├── models/          # Interfaces TypeScript (Block, Transaction, UTXO...)
├── services/        # Lógica de negocio (Signals-based)
│   ├── blockchain.service.ts
│   ├── crypto.service.ts      (SHA-256, ECDSA, P2PKH)
│   ├── target.service.ts      (nBits, PoW, mining)
│   └── mempool.service.ts
├── components/      # Componentes reutilizables
│   ├── block/                  # Visualización de bloque + minería
│   ├── chain-info/             # Info de cadena
│   ├── mempool/                # Transacciones pendientes
│   ├── peer-info/              # Consenso entre peers
│   ├── utxo-set/               # UTXO set table
│   └── merkle-tree/            # Visualización árbol de Merkle
├── pages/           # Páginas lazy-loaded (7 rutas)
└── workers/         # Web Worker para minería asíncrona
```

### CI/CD

- **CI**: Lint + build en cada push y PR a `master`
- **Deploy**: Build + deploy a GitHub Pages vía `actions/deploy-pages`

---

## Licencia

MIT — basado en el trabajo de [Anders Brownworth](https://github.com/anders94) (2016) y [José Maldonado](https://github.com/yukiteruamano) (2022-2026).
