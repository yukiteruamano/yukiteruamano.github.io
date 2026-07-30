import { MempoolService } from './mempool.service';
import type { Transaction } from '@models/block';

function makeTx(txid: string, fee = 0): Transaction {
  return {
    txid,
    inputs: [
      { previousTxHash: '00'.repeat(32), outputIndex: 0, scriptSig: '', sequence: 0xffffffff },
    ],
    outputs: [{ value: 100, scriptPubKey: '', address: '1address' }],
    isCoinbase: false,
    locktime: 0,
    fee,
  };
}

describe('MempoolService', () => {
  let service: MempoolService;

  beforeEach(() => {
    service = new MempoolService();
    service.clear();
  });

  describe('addTransaction', () => {
    it('should add a transaction to pending', () => {
      const tx = makeTx('tx1', 100);
      service.addTransaction(tx, 250);
      expect(service.getPendingCount()).toBe(1);
    });

    it('should sort by fee rate descending', () => {
      service.addTransaction(makeTx('tx1', 100), 200);
      service.addTransaction(makeTx('tx2', 500), 250);
      service.addTransaction(makeTx('tx3', 50), 100);

      const entries = service.pending();
      expect(entries[0].transaction.txid).toBe('tx2');
      expect(entries[1].transaction.txid).toBe('tx1');
      expect(entries[2].transaction.txid).toBe('tx3');
    });

    it('should handle transaction with zero fee', () => {
      service.addTransaction(makeTx('tx1', 0), 100);
      expect(service.getPendingCount()).toBe(1);
    });
  });

  describe('removeTransactions', () => {
    it('should remove specified transactions', () => {
      service.addTransaction(makeTx('tx1'), 200);
      service.addTransaction(makeTx('tx2'), 200);
      service.addTransaction(makeTx('tx3'), 200);

      service.removeTransactions(['tx1', 'tx3']);

      expect(service.getPendingCount()).toBe(1);
      expect(service.pending()[0].transaction.txid).toBe('tx2');
    });

    it('should handle removing non-existent txids', () => {
      service.addTransaction(makeTx('tx1'), 200);
      service.removeTransactions(['nonexistent']);
      expect(service.getPendingCount()).toBe(1);
    });
  });

  describe('selectForBlock', () => {
    it('should select transactions within size limit', () => {
      service.addTransaction(makeTx('tx1'), 500);
      service.addTransaction(makeTx('tx2'), 500);
      service.addTransaction(makeTx('tx3'), 500);

      const selected = service.selectForBlock(1000);
      expect(selected.length).toBe(2);
    });

    it('should select highest fee rate first', () => {
      service.addTransaction(makeTx('tx1', 10), 250);
      service.addTransaction(makeTx('tx2', 50), 250);
      service.addTransaction(makeTx('tx3', 20), 250);

      const selected = service.selectForBlock(1000000);
      expect(selected[0].txid).toBe('tx2');
      expect(selected[1].txid).toBe('tx3');
      expect(selected[2].txid).toBe('tx1');
    });

    it('should return empty array when mempool is empty', () => {
      const selected = service.selectForBlock();
      expect(selected.length).toBe(0);
    });
  });

  describe('getTxById', () => {
    it('should find transaction by txid', () => {
      service.addTransaction(makeTx('tx1'), 200);
      const entry = service.getTxById('tx1');
      expect(entry).toBeDefined();
      expect(entry!.transaction.txid).toBe('tx1');
    });

    it('should return undefined for non-existent txid', () => {
      const entry = service.getTxById('notfound');
      expect(entry).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should empty the mempool', () => {
      service.addTransaction(makeTx('tx1'), 200);
      service.addTransaction(makeTx('tx2'), 200);
      service.clear();
      expect(service.getPendingCount()).toBe(0);
    });
  });
});
