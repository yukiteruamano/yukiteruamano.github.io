export interface UTXO {
  txid: string;
  outputIndex: number;
  value: number;
  address: string;
  scriptPubKey: string;
}
