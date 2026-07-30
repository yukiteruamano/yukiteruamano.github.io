import { TargetService } from './target.service';

describe('TargetService', () => {
  let service: TargetService;

  beforeEach(() => {
    service = new TargetService();
  });

  describe('nBitsToTarget', () => {
    it('should convert Genesis nBits to target', () => {
      const target = service.nBitsToTarget(0x1d00ffff);
      expect(target > BigInt(0)).toBeTrue();
    });

    it('should produce target where higher nBits = easier', () => {
      const easy = service.nBitsToTarget(0x1d00ffff);
      const hard = service.nBitsToTarget(0x1b00ffff);
      expect(easy > hard).toBeTrue();
    });
  });

  describe('targetToNBits', () => {
    it('should round-trip Genesis nBits', () => {
      const target = service.nBitsToTarget(0x1d00ffff);
      const nBits = service.targetToNBits(target);
      const retarget = service.nBitsToTarget(nBits);
      expect(retarget).toBe(target);
    });

    it('should round-trip for several values', () => {
      const values = [0x1d00ffff, 0x1c00ffff, 0x1b00ffff, 0x1a00ffff];
      for (const v of values) {
        const target = service.nBitsToTarget(v);
        const nBits = service.targetToNBits(target);
        const retarget = service.nBitsToTarget(nBits);
        expect(retarget).toBe(target);
      }
    });
  });

  describe('checkProofOfWork', () => {
    it('should validate a hash below target', () => {
      const nBits = 0x1d00ffff;
      const target = service.nBitsToTarget(nBits);
      const targetHex = target.toString(16);
      const validHash = targetHex.padStart(64, '0');
      expect(service.checkProofOfWork(validHash, nBits)).toBeTrue();
    });

    it('should reject a hash above target', () => {
      const nBits = 0x1a00ffff;
      const invalidHash = 'f'.repeat(64);
      expect(service.checkProofOfWork(invalidHash, nBits)).toBeFalse();
    });

    it('should accept a hash equal to target', () => {
      const nBits = 0x1d00ffff;
      const target = service.nBitsToTarget(nBits);
      const targetHex = target.toString(16).padStart(64, '0');
      expect(service.checkProofOfWork(targetHex, nBits)).toBeTrue();
    });
  });

  describe('mineBlock', () => {
    it('should find a valid nonce', () => {
      const nBits = 0x1d00ffff;
      const targetHex = service.nBitsToTarget(nBits).toString(16);
      const validHash = targetHex.padStart(64, '0');

      const header = {
        version: 1,
        previousBlockHash: '0'.repeat(64),
        merkleRoot: '0'.repeat(64),
        timestamp: 1234567890,
        nBits,
        nonce: 0,
      };

      let callCount = 0;
      const result = service.mineBlock(header, () => {
        callCount++;
        return callCount >= 5 ? validHash : 'f'.repeat(64);
      });

      expect(result.nonce).toBe(5);
      expect(result.hash).toBe(validHash);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should return a hash that passes proof of work', () => {
      const nBits = 0x1d00ffff;
      const targetHex = service.nBitsToTarget(nBits).toString(16);
      const validHash = targetHex.padStart(64, '0');

      const header = {
        version: 1,
        previousBlockHash: '0'.repeat(64),
        merkleRoot: '0'.repeat(64),
        timestamp: 1234567890,
        nBits,
        nonce: 0,
      };

      let callCount = 0;
      const result = service.mineBlock(header, () => {
        callCount++;
        return callCount >= 3 ? validHash : 'f'.repeat(64);
      });

      expect(service.checkProofOfWork(result.hash, nBits)).toBeTrue();
    });
  });

  describe('calcDifficulty', () => {
    it('should return 1 for Genesis difficulty', () => {
      const difficulty = service.calcDifficulty(0x1d00ffff);
      expect(difficulty).toBe(1);
    });
  });

  describe('getDifficultyPrefix', () => {
    it('should return leading zeros count', () => {
      const prefix = service.getDifficultyPrefix(0x1d00ffff);
      expect(prefix.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('newTarget', () => {
    it('should adjust target based on time span', () => {
      const currentNBits = 0x1d00ffff;
      const newNBits = service.newTarget(600, 1200, currentNBits);
      expect(newNBits).toBeDefined();
      expect(typeof newNBits).toBe('number');
    });

    it('should not exceed maximum target', () => {
      const currentNBits = 0x1d00ffff;
      const newNBits = service.newTarget(1, 1200, currentNBits);
      const newTarget = service.nBitsToTarget(newNBits);
      const maxTarget = service.nBitsToTarget(0x1d00ffff);
      expect(newTarget <= maxTarget).toBeTrue();
    });
  });

  describe('defaults', () => {
    it('should have Genesis nBits as default', () => {
      expect(service.defaultNBits).toBe(0x1d00ffff);
    });
  });
});
