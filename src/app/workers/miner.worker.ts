/// <reference lib="webworker" />

async function sha256d(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const firstHash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const secondHash = await crypto.subtle.digest('SHA-256', firstHash);
  const hashArray = Array.from(new Uint8Array(secondHash));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

addEventListener('message', async ({ data }) => {
  const { version, previousBlockHash, merkleRoot, timestamp, nBits, targetHex } = data;

  const start = performance.now();
  const prefix = `${version}${previousBlockHash}${merkleRoot}${timestamp}${nBits}`;
  let nonce = 0;
  let hash = '';
  const target = BigInt('0x' + targetHex);
  let found = false;

  while (!found) {
    nonce++;
    hash = await sha256d(prefix + nonce.toString());

    if (BigInt('0x' + hash) <= target) {
      found = true;
    }
  }

  const duration = (performance.now() - start) / 1000;

  postMessage({ nonce, hash, duration });
});
