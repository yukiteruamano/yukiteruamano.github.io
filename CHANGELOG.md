# Changelog

## [3.0.0] — 2026-07-30

### 🚀 Fundamentos
- Tooling: ESLint 9 + Prettier 3 + EditorConfig + Browserslist
- TypeScript strict con tipado completo (0 `any`)
- `.nvmrc` para Node 20 LTS

### 🧹 Modernización
- Eliminado todo el código legacy AngularJS 1.x (~28K líneas)
- Migración completa al nuevo control flow `@if`/`@for`/`@switch`
- Eliminado `CommonModule` — solo imports granulares (`DecimalPipe`)
- Constantes extraídas (`ZERO_HASH`, `GENESIS_NBITS`, etc.)
- Modelos separados en 8 interfaces individuales

### ⚡ Arquitectura de Signals
- `computed()` para `chainValid` y `balancesMap` (O(1) lookup)
- `readonly` en todos los `inject()`
- Simplificación de `AppComponent` (-56% líneas)

### ⛏️ Minado Asíncrono
- Web Worker con `crypto.subtle` nativo (565 bytes)
- Spinner Bootstrap animado durante minado
- UI no se bloquea

### 🔒 Seguridad
- `sha256Async`/`sha256dAsync` con Web Crypto API + fallback
- Content-Security-Policy configurada
- Sanitización de claves privadas en `OnDestroy`

### 🧪 Testing
- 61 tests unitarios (Crypto, Target, Mempool, Blockchain, BlockComponent)
- Karma + Jasmine + ChromeHeadless configurados

### 🚀 CI/CD
- GitHub Actions: `ci.yml` (lint + build) + `deploy.yml` (GitHub Pages)
- `postbuild` script: flatten `docs/browser/` → `docs/` + `404.html` SPA routing
- Hash routing (`/#/ruta`) con 404 redirect para deep links

### ♿ Accesibilidad
- Formularios semánticos `<label for>` + `<input id>`
- 15+ atributos `aria-*` (`aria-label`, `aria-live`, `role`)
- Tablas responsive con `overflow-x: auto`

### 🎨 Tema Oscuro
- 17 variables CSS custom properties
- Toggle 🌙/☀️ en navbar
- Detección automática `prefers-color-scheme` + localStorage
- Anti-FOUC script inline
- Transiciones suaves 0.3s

### 📊 Merkle Tree
- Componente interactivo de visualización
- Nodos hoja → raíz con conectores y tooltips

### ⬆️ Dependencias
- Angular 18.2 → **19.2**
- TypeScript 5.5 → **5.6**
- zone.js 0.14 → **0.15**

---

## [2.0.0] — 2025

- Migración inicial a Angular 18 con standalone components
- Servicios con Signals
- ECDSA (secp256k1), modelo UTXO, direcciones P2PKH
- Bootstrap 5, modo experto, hash routing

---

## [1.0.0] — 2022

- Versión original AngularJS 1.x
- Basado en el trabajo de [Anders Brownworth](https://github.com/anders94)
- SHA-256 interactivo, bloques, blockchain, red P2P, tokens, coinbase
