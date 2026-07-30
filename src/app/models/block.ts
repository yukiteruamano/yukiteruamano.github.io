export interface BlockHeader {
  version: number;
  previousBlockHash: string;
  merkleRoot: string;
  timestamp: number;
  nBits: number;
  nonce: number;
}

export interface Block {
  header: BlockHeader;
  transactions: Transaction[];
  hash: string;
  height: number;
  valid: boolean;
  mined: boolean;
  miningStats?: string;
}

export interface TxIn {
  previousTxHash: string;
  outputIndex: number;
  scriptSig: string;
  sequence: number;
}

export interface TxOut {
  value: number;
  scriptPubKey: string;
  address: string;
}

export interface Transaction {
  txid: string;
  inputs: TxIn[];
  outputs: TxOut[];
  isCoinbase: boolean;
  locktime: number;
  fee?: number;
  size?: number;
}

export interface UTXO {
  txid: string;
  outputIndex: number;
  value: number;
  address: string;
  scriptPubKey: string;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  address: string;
}

export interface Peer {
  name: string;
  blocks: Block[];
  utxoSet: UTXO[];
  mempool: Transaction[];
}

export interface MempoolEntry {
  transaction: Transaction;
  feeRate: number;
  size: number;
  timestamp: number;
}

export interface MiningJob {
  header: BlockHeader;
  targetHex: string;
}
