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
