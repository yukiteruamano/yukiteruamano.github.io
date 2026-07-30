import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { BlockComponent } from './block.component';
import { CryptoService } from '@services/crypto.service';
import { TargetService } from '@services/target.service';
import { BlockchainService } from '@services/blockchain.service';
import { MempoolService } from '@services/mempool.service';
import type { Block } from '@models/block';

function makeBlock(overrides: Partial<Block> = {}): Block {
  return {
    header: {
      version: 1,
      previousBlockHash: '0'.repeat(64),
      merkleRoot: '0'.repeat(64),
      timestamp: 1234567890,
      nBits: 0x1d00ffff,
      nonce: 0,
    },
    transactions: [],
    hash: '0'.repeat(64),
    height: 1,
    valid: false,
    mined: false,
    ...overrides,
  };
}

describe('BlockComponent', () => {
  let component: BlockComponent;
  let fixture: ComponentFixture<BlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockComponent],
      providers: [CryptoService, TargetService, BlockchainService, MempoolService],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.block = makeBlock();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display block fields', () => {
    component.block = makeBlock({ height: 5 });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Bloque:');
    expect(compiled.textContent).toContain('Hash:');
  });

  it('should show mine button by default', () => {
    component.block = makeBlock();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toContain('Mine');
  });

  it('should disable mine button during mining', () => {
    component.block = makeBlock();
    component.mining = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should emit blockChanged on update', () => {
    component.block = makeBlock();
    fixture.detectChanges();

    let emitted: Block | undefined;
    component.blockChanged.subscribe((b: Block) => (emitted = b));

    component.updateBlock();

    expect(emitted).toBeDefined();
    expect(emitted!.header.merkleRoot).toMatch(/^[0-9a-f]{64}$/);
  });

  it('should hide mine button when showMineButton is false', () => {
    component.block = makeBlock();
    component.showMineButton = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeNull();
  });
});
