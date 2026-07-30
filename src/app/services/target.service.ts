import { Injectable } from '@angular/core';
import type { BlockHeader } from '@models/block';
import { GENESIS_NBITS } from '@app/constants';

@Injectable({ providedIn: 'root' })
export class TargetService {
  readonly defaultNBits = GENESIS_NBITS;
  readonly maxTarget = this.nBitsToTarget(GENESIS_NBITS);

  nBitsToTarget(nBits: number): bigint {
    const exponent = (nBits >> 24) & 0xff;
    const mantissa = nBits & 0xffffff;
    const hex = mantissa.toString(16).padStart(6, '0');
    const target = BigInt('0x' + hex) * BigInt(2) ** BigInt(8 * (exponent - 3));
    return target;
  }

  targetToNBits(target: bigint): number {
    if (target === BigInt(0)) return 0;

    const hex = target.toString(16);
    const nSize = Math.ceil(hex.length / 2);

    let mantissa: number;
    if (nSize <= 3) {
      mantissa = Number(target << BigInt(8 * (3 - nSize)));
    } else {
      const shift = BigInt(8 * (nSize - 3));
      mantissa = Number(target >> shift);
    }

    if (mantissa > 0x7fffff) {
      mantissa >>= 8;
      return ((nSize + 1) << 24) | (mantissa & 0xffffff);
    }

    return (nSize << 24) | (mantissa & 0xffffff);
  }

  hashToBigInt(hash: string): bigint {
    return BigInt('0x' + hash);
  }

  checkProofOfWork(hash: string, nBits: number): boolean {
    const target = this.nBitsToTarget(nBits);
    const hashValue = this.hashToBigInt(hash);
    return hashValue <= target;
  }

  mineBlock(
    header: BlockHeader,
    hashFunction: (input: string) => string,
  ): { nonce: number; hash: string; duration: number } {
    const start = performance.now();
    const target = this.nBitsToTarget(header.nBits);
    let nonce = 0;
    let hash: string;

    const prefix = `${header.version}${header.previousBlockHash}${header.merkleRoot}${header.timestamp}${header.nBits.toString(16)}`;

    do {
      nonce++;
      hash = hashFunction(prefix + nonce);
    } while (this.hashToBigInt(hash) > target);

    const duration = (performance.now() - start) / 1000;

    return { nonce, hash, duration };
  }

  mineBlockAsync(header: BlockHeader): Promise<{ nonce: number; hash: string; duration: number }> {
    return new Promise((resolve) => {
      const worker = new Worker(new URL('../workers/miner.worker', import.meta.url), {
        type: 'module',
      });

      const targetHex = this.nBitsToTarget(header.nBits).toString(16);

      worker.postMessage({
        version: header.version,
        previousBlockHash: header.previousBlockHash,
        merkleRoot: header.merkleRoot,
        timestamp: header.timestamp,
        nBits: header.nBits,
        targetHex,
      });

      worker.addEventListener('message', ({ data }) => {
        worker.terminate();
        resolve(data);
      });
    });
  }

  calcDifficulty(nBits: number): number {
    const target = this.nBitsToTarget(nBits);
    const genesisTarget = this.nBitsToTarget(GENESIS_NBITS);
    return Number(genesisTarget) / Number(target);
  }

  getDifficultyPrefix(nBits: number): string {
    const target = this.nBitsToTarget(nBits);
    const hex = target.toString(16).padStart(64, '0');
    let zeros = 0;
    for (const ch of hex) {
      if (ch === '0') zeros++;
      else break;
    }
    return '0'.repeat(zeros);
  }

  newTarget(actualTimeSpan: number, expectedTimeSpan: number, currentNBits: number): number {
    const currentTarget = this.nBitsToTarget(currentNBits);
    let newTarget = (currentTarget * BigInt(Math.floor(actualTimeSpan))) / BigInt(expectedTimeSpan);

    if (newTarget > this.maxTarget) {
      newTarget = this.maxTarget;
    }

    const maxAdjustDown = currentTarget / BigInt(4);
    if (newTarget < maxAdjustDown) {
      newTarget = maxAdjustDown;
    }

    const maxAdjustUp = currentTarget * BigInt(4);
    if (newTarget > maxAdjustUp) {
      newTarget = maxAdjustUp;
    }

    return this.targetToNBits(newTarget);
  }
}
