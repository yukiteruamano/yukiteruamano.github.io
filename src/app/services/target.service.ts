import { Injectable } from '@angular/core';
import type { BlockHeader } from '@models/block';

const GENESIS_NBITS = 0x1d00ffff;

@Injectable({ providedIn: 'root' })
export class TargetService {
  readonly defaultNBits = GENESIS_NBITS;
  readonly maxTarget = this.nBitsToTarget(0x1d00ffff);

  nBitsToTarget(nBits: number): bigint {
    const exponent = (nBits >> 24) & 0xff;
    const mantissa = nBits & 0xffffff;
    const hex = mantissa.toString(16).padStart(6, '0');
    const target = BigInt('0x' + hex) * BigInt(2) ** BigInt(8 * (exponent - 3));
    return target;
  }

  targetToNBits(target: bigint): number {
    const hex = target.toString(16).padStart(64, '0');
    const targetStr = hex.replace(/^0+/, '');
    const length = hex.length / 2;
    const exponent = length;
    const coefficientHex = hex.slice(0, 6);
    const coefficient = parseInt(coefficientHex || '0', 16);

    if (coefficient > 0x7fffff) {
      return ((exponent + 1) << 24) | (coefficient >> 8);
    }

    return (exponent << 24) | coefficient;
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
