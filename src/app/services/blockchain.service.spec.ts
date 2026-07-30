import { TestBed } from '@angular/core/testing';
import { BlockchainService } from './blockchain.service';
import { CryptoService } from './crypto.service';
import { TargetService } from './target.service';
import { MempoolService } from './mempool.service';

describe('BlockchainService', () => {
  let service: BlockchainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlockchainService, CryptoService, TargetService, MempoolService],
    });
    service = TestBed.inject(BlockchainService);
  });

  describe('sha256 and sha256d', () => {
    it('should compute SHA-256 hash', () => {
      const hash = service.sha256('test');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should compute double SHA-256', () => {
      const single = service.sha256('data');
      const double = service.sha256d('data');
      expect(single).not.toBe(double);
    });
  });

  describe('createGenesisBlock', () => {
    it('should create a genesis block with height 0', () => {
      const genesis = service.createGenesisBlock();
      expect(genesis.height).toBe(0);
      expect(genesis.valid).toBeTrue();
      expect(genesis.mined).toBeFalse();
      expect(genesis.hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should have zero hash as previous block hash', () => {
      const genesis = service.createGenesisBlock();
      expect(genesis.header.previousBlockHash).toBe(
        '0000000000000000000000000000000000000000000000000000000000000000',
      );
    });
  });

  describe('createCoinbaseTransaction', () => {
    it('should create a coinbase transaction', () => {
      const tx = service.createCoinbaseTransaction('1TestAddress', 50, 0);
      expect(tx.isCoinbase).toBeTrue();
      expect(tx.inputs.length).toBe(1);
      expect(tx.outputs.length).toBe(1);
      expect(tx.outputs[0].value).toBe(50);
      expect(tx.outputs[0].address).toBe('1TestAddress');
    });
  });

  describe('chainValid', () => {
    it('should report empty chain as valid', () => {
      expect(service.chainValid()).toBeTrue();
    });
  });

  describe('createPeer', () => {
    it('should create a peer with blocks', () => {
      const peer = service.createPeer('Peer X', [
        { number: 1, nonce: 100, data: {} },
        { number: 2, nonce: 200, data: {} },
      ]);
      expect(peer.name).toBe('Peer X');
      expect(peer.blocks.length).toBe(2);
      expect(peer.blocks[1].header.previousBlockHash).toBe(peer.blocks[0].hash);
    });
  });

  describe('round', () => {
    it('should format numbers with thousands separators', () => {
      const formatted = service.round(1234567, 0);
      expect(formatted).toContain("'");
    });
  });

  describe('expert mode', () => {
    it('should toggle expert mode', () => {
      expect(service.expertMode()).toBeFalse();
      service.toggleExpertMode();
      expect(service.expertMode()).toBeTrue();
    });

    it('should set difficulty', () => {
      service.setDifficulty(8);
      expect(service.difficulty()).toBe(8);
    });

    it('should set nBits', () => {
      service.setNBits(0x1b00ffff);
      expect(service.currentNBits()).toBe(0x1b00ffff);
    });
  });
});
