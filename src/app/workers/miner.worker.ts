addEventListener('message', ({ data }) => {
  const { version, previousBlockHash, merkleRoot, timestamp, nBits, hashFunctionName } = data;
  const targetHex = data.targetHex;

  importScripts('/assets/sha256-worker.js');

  const start = performance.now();
  const prefix = `${version}${previousBlockHash}${merkleRoot}${timestamp}${nBits}`;
  let nonce = 0;
  let hash: string = '';
  const target = BigInt('0x' + targetHex);
  let found = false;

  while (!found) {
    nonce++;
    hash = computeSHA256(prefix + nonce.toString());

    if (BigInt('0x' + hash) <= target) {
      found = true;
    }
  }

  const duration = (performance.now() - start) / 1000;

  postMessage({ nonce, hash, duration });
});
