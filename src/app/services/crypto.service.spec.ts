import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    service = new CryptoService();
  });

  describe('sha256', () => {
    it('should produce a 64-character hex string', () => {
      const result = service.sha256('hello');
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should be deterministic', () => {
      const a = service.sha256('test');
      const b = service.sha256('test');
      expect(a).toBe(b);
    });

    it('should produce different hashes for different inputs', () => {
      const a = service.sha256('hello');
      const b = service.sha256('world');
      expect(a).not.toBe(b);
    });

    it('should return known hash for empty string', () => {
      const result = service.sha256('');
      expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  describe('sha256d', () => {
    it('should produce a 64-character hex string', () => {
      const result = service.sha256d('test');
      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should differ from single sha256', () => {
      const single = service.sha256('data');
      const double = service.sha256d('data');
      expect(single).not.toBe(double);
    });

    it('should be deterministic', () => {
      const a = service.sha256d('blockchain');
      const b = service.sha256d('blockchain');
      expect(a).toBe(b);
    });
  });

  describe('generateKeyPair', () => {
    it('should generate a valid ECDSA key pair', () => {
      const keyPair = service.generateKeyPair();
      expect(keyPair).toBeDefined();
      expect(keyPair.privateKey).toMatch(/^[0-9a-f]{64}$/);
      expect(keyPair.publicKey).toMatch(/^[0-9a-f]{66}$/);
      expect(keyPair.address).toMatch(/^1[1-9A-HJ-NP-Za-km-z]{25,34}$/);
    });

    it('should generate unique keys each time', () => {
      const a = service.generateKeyPair();
      const b = service.generateKeyPair();
      expect(a.privateKey).not.toBe(b.privateKey);
      expect(a.publicKey).not.toBe(b.publicKey);
      expect(a.address).not.toBe(b.address);
    });
  });

  describe('sign and verify', () => {
    it('should sign and verify a message', () => {
      const keyPair = service.generateKeyPair();
      const message = 'test transaction';
      const signature = service.sign(keyPair.privateKey, message);
      const valid = service.verify(keyPair.publicKey, message, signature);
      expect(valid).toBeTrue();
    });

    it('should reject tampered message', () => {
      const keyPair = service.generateKeyPair();
      const message = 'test transaction';
      const signature = service.sign(keyPair.privateKey, message);
      const valid = service.verify(keyPair.publicKey, 'tampered', signature);
      expect(valid).toBeFalse();
    });

    it('should reject wrong public key', () => {
      const keyPairA = service.generateKeyPair();
      const keyPairB = service.generateKeyPair();
      const signature = service.sign(keyPairA.privateKey, 'message');
      const valid = service.verify(keyPairB.publicKey, 'message', signature);
      expect(valid).toBeFalse();
    });
  });

  describe('computeMerkleRoot', () => {
    it('should return zero hash for empty array', () => {
      const root = service.computeMerkleRoot([]);
      expect(root).toBe('0000000000000000000000000000000000000000000000000000000000000000');
    });

    it('should return single txid for one transaction', () => {
      const txid = service.sha256d('tx1');
      const root = service.computeMerkleRoot([txid]);
      expect(root).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should compute merkle root for multiple transactions', () => {
      const txs = ['tx1', 'tx2', 'tx3'].map((t) => service.sha256d(t));
      const root = service.computeMerkleRoot(txs);
      expect(root).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should be deterministic', () => {
      const txs = ['a', 'b', 'c', 'd'].map((t) => service.sha256d(t));
      const a = service.computeMerkleRoot(txs);
      const b = service.computeMerkleRoot(txs);
      expect(a).toBe(b);
    });
  });

  describe('buildMerkleTree', () => {
    it('should return a tree with levels', () => {
      const txs = ['a', 'b', 'c', 'd', 'e'].map((t) => service.sha256d(t));
      const tree = service.buildMerkleTree(txs);
      expect(tree.length).toBeGreaterThan(1);
      expect(tree[0]).toEqual(txs);
      expect(tree[tree.length - 1].length).toBe(1);
    });
  });

  describe('pubKeyToAddress', () => {
    it('should produce a valid P2PKH address', () => {
      const keyPair = service.generateKeyPair();
      const address = service.pubKeyToAddress(keyPair.publicKey);
      expect(address).toMatch(/^1/);
      expect(address.length).toBeGreaterThanOrEqual(26);
      expect(address.length).toBeLessThanOrEqual(35);
    });
  });

  describe('computeTxid', () => {
    it('should compute a txid via sha256d', () => {
      const txid = service.computeTxid('transaction data');
      expect(txid).toMatch(/^[0-9a-f]{64}$/);
      expect(txid).toBe(service.sha256d('transaction data'));
    });
  });
});
