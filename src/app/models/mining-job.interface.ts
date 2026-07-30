import type { BlockHeader } from './block-header.interface';

export interface MiningJob {
  header: BlockHeader;
  targetHex: string;
}
