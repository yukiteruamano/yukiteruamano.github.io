import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import { sha256 as hjsSHA256, ripemd160 } from 'hash.js';
import * as bs58 from 'bs58';
import type { KeyPair } from '@models/block';

const elliptic = new EC('secp256k1');

function bufferToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

@Injectable({ providedIn: 'root' })
export class CryptoService {
  sha256(input: string): string {
    return CryptoJS.SHA256(input).toString();
  }

  sha256d(input: string): string {
    return CryptoJS.SHA256(CryptoJS.SHA256(input)).toString();
  }

  hash160(data: Uint8Array): string {
    const shaResult = new Uint8Array(hjsSHA256().update(data).digest());
    return ripemd160().update(shaResult).digest('hex');
  }

  generateKeyPair(): KeyPair {
    const key = elliptic.genKeyPair();
    const privKey = key.getPrivate('hex');
    const pubKey = key.getPublic(true, 'hex');
    const address = this.pubKeyToAddress(pubKey);

    return {
      privateKey: privKey,
      publicKey: pubKey,
      address,
    };
  }

  pubKeyToAddress(publicKeyHex: string): string {
    const pubKeyBuffer = hexToBuffer(publicKeyHex);
    const h160 = this.hash160(pubKeyBuffer);

    const versionedPayload = new Uint8Array(1 + h160.length / 2);
    versionedPayload[0] = 0x00;
    const h160Bytes = hexToBuffer(h160);
    versionedPayload.set(h160Bytes, 1);

    const firstHash = new Uint8Array(hjsSHA256().update(versionedPayload).digest());
    const secondHash = new Uint8Array(hjsSHA256().update(firstHash).digest());
    const checksum = secondHash.slice(0, 4);

    const fullPayload = new Uint8Array(versionedPayload.length + checksum.length);
    fullPayload.set(versionedPayload, 0);
    fullPayload.set(checksum, versionedPayload.length);

    return bs58.encode(fullPayload);
  }

  sign(privateKeyHex: string, message: string): string {
    const key = elliptic.keyFromPrivate(privateKeyHex, 'hex');
    const msgHash = CryptoJS.SHA256(message).toString();
    const sig = key.sign(msgHash);
    return sig.toDER('hex');
  }

  verify(publicKeyHex: string, message: string, signature: string): boolean {
    const key = elliptic.keyFromPublic(publicKeyHex, 'hex');
    const msgHash = CryptoJS.SHA256(message).toString();
    return key.verify(msgHash, signature);
  }

  computeTxid(txInput: string): string {
    return this.sha256d(txInput);
  }

  computeMerkleRoot(txids: string[]): string {
    if (txids.length === 0) {
      return '0000000000000000000000000000000000000000000000000000000000000000';
    }

    let tree = [...txids];

    while (tree.length > 1) {
      const newLevel: string[] = [];

      for (let i = 0; i < tree.length; i += 2) {
        const left = tree[i];
        const right = i + 1 < tree.length ? tree[i + 1] : left;
        newLevel.push(this.sha256d(left + right));
      }

      tree = newLevel;
    }

    return tree[0];
  }

  buildMerkleTree(txids: string[]): string[][] {
    const levels: string[][] = [txids];
    let current = txids;

    while (current.length > 1) {
      const newLevel: string[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const left = current[i];
        const right = i + 1 < current.length ? current[i + 1] : left;
        newLevel.push(this.sha256d(left + right));
      }
      levels.push(newLevel);
      current = newLevel;
    }

    return levels;
  }
}
