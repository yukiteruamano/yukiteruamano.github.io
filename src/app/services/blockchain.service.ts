import { Injectable, signal } from '@angular/core';
import type { Block, BlockHeader, Transaction, TxIn, TxOut, UTXO, Peer } from '@models/block';
import { CryptoService } from './crypto.service';
import { TargetService } from './target.service';
import { MempoolService } from './mempool.service';

@Injectable({ providedIn: 'root' })
export class BlockchainService {
  readonly chain = signal<Block[]>([]);
  readonly utxoSet = signal<UTXO[]>([]);
  readonly expertMode = signal(false);
  readonly difficulty = signal(4);
  readonly currentNBits = signal(0x1d00ffff);

  private idCounter = 0;

  constructor(
    private crypto: CryptoService,
    private targetService: TargetService,
    private mempool: MempoolService,
  ) {}

  newId(): number {
    return this.idCounter++;
  }

  sha256(input: string): string {
    return this.crypto.sha256(input);
  }

  sha256d(input: string): string {
    return this.crypto.sha256d(input);
  }

  difficultyPrefix(difficulty?: number): string {
    const diff = difficulty ?? this.difficulty();
    return '0'.repeat(diff);
  }

  formatString(str: string, ...args: string[]): string {
    return str.replace(/%s/g, () => args.shift() || '');
  }

  round(number: number, digits: number): string {
    const exp = Math.pow(10, digits);
    return (Math.round(number * exp) / exp).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  createGenesisBlock(): Block {
    const header: BlockHeader = {
      version: 1,
      previousBlockHash: '0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: this.crypto.sha256d(''),
      timestamp: Math.floor(Date.now() / 1000),
      nBits: this.currentNBits(),
      nonce: 0,
    };

    const hash = this.hashHeader(header);
    header.nonce = 0;

    return {
      header,
      transactions: [],
      hash,
      height: 0,
      valid: true,
      mined: false,
    };
  }

  hashHeader(header: BlockHeader): string {
    const data =
      header.version.toString() +
      header.previousBlockHash +
      header.merkleRoot +
      header.timestamp.toString() +
      header.nBits.toString(16) +
      header.nonce;
    return this.crypto.sha256d(data);
  }

  createBlock(
    previousBlock: Block,
    transactions: Transaction[],
    coinbase: Transaction | null,
  ): Block {
    const txids = transactions.map((t) => t.txid);
    const merkleRoot = this.crypto.computeMerkleRoot(txids);

    const header: BlockHeader = {
      version: 1,
      previousBlockHash: previousBlock.hash,
      merkleRoot,
      timestamp: Math.floor(Date.now() / 1000),
      nBits: this.currentNBits(),
      nonce: 1,
    };

    const allTxs = coinbase ? [coinbase, ...transactions] : [...transactions];

    const hash = this.hashHeader(header);

    return {
      header,
      transactions: allTxs,
      hash,
      height: previousBlock.height + 1,
      valid: false,
      mined: false,
    };
  }

  createCoinbaseTransaction(address: string, reward: number, blockHeight: number): Transaction {
    const txIn: TxIn = {
      previousTxHash: '0000000000000000000000000000000000000000000000000000000000000000',
      outputIndex: 0xffffffff,
      scriptSig: blockHeight.toString(16),
      sequence: 0xffffffff,
    };

    const txOut: TxOut = {
      value: reward,
      scriptPubKey: `OP_DUP OP_HASH160 ${address} OP_EQUALVERIFY OP_CHECKSIG`,
      address,
    };

    const txInput = `${txIn.previousTxHash}${txIn.outputIndex}${JSON.stringify(txOut)}`;
    const txid = this.crypto.computeTxid(txInput);

    return {
      txid,
      inputs: [txIn],
      outputs: [txOut],
      isCoinbase: true,
      locktime: 0,
    };
  }

  createTransaction(
    senderAddress: string,
    recipientAddress: string,
    amount: number,
    fee: number,
    utxos: UTXO[],
    senderKeyPair: { privateKey: string; publicKey: string; address: string },
  ): Transaction | null {
    const senderUTXOs = utxos.filter((u) => u.address === senderAddress);
    let totalInput = 0;
    const selectedUTXOs: UTXO[] = [];
    const totalNeeded = amount + fee;

    for (const utxo of senderUTXOs) {
      selectedUTXOs.push(utxo);
      totalInput += utxo.value;
      if (totalInput >= totalNeeded) break;
    }

    if (totalInput < totalNeeded) return null;

    const inputs: TxIn[] = selectedUTXOs.map((utxo) => ({
      previousTxHash: utxo.txid,
      outputIndex: utxo.outputIndex,
      scriptSig: '',
      sequence: 0xffffffff,
    }));

    const outputs: TxOut[] = [
      {
        value: amount,
        scriptPubKey: `OP_DUP OP_HASH160 ${recipientAddress} OP_EQUALVERIFY OP_CHECKSIG`,
        address: recipientAddress,
      },
    ];

    const change = totalInput - amount - fee;
    if (change > 0) {
      outputs.push({
        value: change,
        scriptPubKey: `OP_DUP OP_HASH160 ${senderAddress} OP_EQUALVERIFY OP_CHECKSIG`,
        address: senderAddress,
      });
    }

    const txInput =
      inputs.map((i) => `${i.previousTxHash}${i.outputIndex}`).join('') +
      outputs.map((o) => `${o.value}${o.address}`).join('');
    const txid = this.crypto.computeTxid(txInput);

    const message = txid;
    const signature = this.crypto.sign(senderKeyPair.privateKey, message);

    inputs.forEach((input) => {
      input.scriptSig = `${signature} ${senderKeyPair.publicKey}`;
    });

    return {
      txid,
      inputs,
      outputs,
      isCoinbase: false,
      locktime: 0,
      fee,
    };
  }

  mineBlock(block: Block): { nonce: number; hash: string; duration: number } {
    const result = this.targetService.mineBlock(block.header, (input) =>
      this.crypto.sha256d(input),
    );
    block.header.nonce = result.nonce;
    block.hash = result.hash;
    block.valid = this.targetService.checkProofOfWork(result.hash, block.header.nBits);
    block.mined = true;
    block.miningStats = ` took ${this.round(result.duration, 1)}s, hashes: ${this.round(result.nonce, 0)}`;
    return result;
  }

  addBlock(block: Block, mempoolTxs: Transaction[]): void {
    block.valid = this.validateBlock(block);
    this.chain.update((chain) => [...chain, block]);

    const currentUTXOs = this.utxoSet();

    for (const tx of block.transactions) {
      for (const input of tx.inputs) {
        const idx = currentUTXOs.findIndex(
          (u) => u.txid === input.previousTxHash && u.outputIndex === input.outputIndex,
        );
        if (idx !== -1) {
          currentUTXOs.splice(idx, 1);
        }
      }

      for (let i = 0; i < tx.outputs.length; i++) {
        const output = tx.outputs[i];
        currentUTXOs.push({
          txid: tx.txid,
          outputIndex: i,
          value: output.value,
          address: output.address,
          scriptPubKey: output.scriptPubKey,
        });
      }
    }

    this.utxoSet.set([...currentUTXOs]);
    this.mempool.removeTransactions(mempoolTxs.map((t) => t.txid));
  }

  validateBlock(block: Block): boolean {
    const hash = this.hashHeader(block.header);
    if (hash !== block.hash) return false;
    if (!this.targetService.checkProofOfWork(hash, block.header.nBits)) return false;

    const txids = block.transactions.map((t) => t.txid);
    const computedMerkleRoot = this.crypto.computeMerkleRoot(txids);
    if (computedMerkleRoot !== block.header.merkleRoot) return false;

    return true;
  }

  validateChain(blocks: Block[]): boolean {
    if (blocks.length === 0) return true;
    return blocks.every((block) => this.validateBlock(block));
  }

  isChainValid(blocks: Block[]): boolean {
    for (let i = 1; i < blocks.length; i++) {
      if (blocks[i].header.previousBlockHash !== blocks[i - 1].hash) {
        return false;
      }
    }
    return this.validateChain(blocks);
  }

  getBalance(address: string): number {
    return this.utxoSet()
      .filter((u) => u.address === address)
      .reduce((sum, u) => sum + u.value, 0);
  }

  createPeer(
    name: string,
    blocks: { number: number; nonce: number; data: any; prev?: string }[],
  ): Peer {
    const peerBlocks: Block[] = blocks.map((b) => {
      const header: BlockHeader = {
        version: 1,
        previousBlockHash:
          b.prev || '0000000000000000000000000000000000000000000000000000000000000000',
        merkleRoot: this.crypto.sha256d(JSON.stringify(b.data)),
        timestamp: Math.floor(Date.now() / 1000),
        nBits: this.currentNBits(),
        nonce: b.nonce,
      };

      const hash = this.hashHeader(header);

      return {
        header,
        transactions: [],
        hash,
        height: b.number,
        valid: this.targetService.checkProofOfWork(hash, header.nBits),
        mined: true,
      };
    });

    for (let i = 1; i < peerBlocks.length; i++) {
      peerBlocks[i].header.previousBlockHash = peerBlocks[i - 1].hash;
      const hash = this.hashHeader(peerBlocks[i].header);
      peerBlocks[i].hash = hash;
      peerBlocks[i].valid = this.targetService.checkProofOfWork(hash, peerBlocks[i].header.nBits);
    }

    return {
      name,
      blocks: peerBlocks,
      utxoSet: [],
      mempool: [],
    };
  }

  toggleExpertMode(): void {
    this.expertMode.update((v) => !v);
  }

  setDifficulty(value: number): void {
    this.difficulty.set(value);
  }

  setNBits(nBits: number): void {
    this.currentNBits.set(nBits);
  }
}
