// lib/0g-storage.ts
import { Indexer, Blob } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';

/**
 * Uploads a file to 0G Storage. 
 * The Indexer.upload method handles the Flow contract 'submit' (on-chain logging) 
 * and the physical data transfer in one go.
 */
export async function uploadTo0G(file: File, signer: ethers.Signer) {
  const indexer = new Indexer(process.env.NEXT_PUBLIC_0G_STORAGE_RPC!);

  // 1. Create a 0G-compatible Blob from the browser File
  const fileArrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(fileArrayBuffer);
  const zgBlob = new Blob(uint8Array);

  // 2. Calculate Merkle Tree (needed for the root hash)
  const [tree, treeErr] = await zgBlob.merkleTree();
  if (treeErr) throw new Error(`Merkle Tree Error: ${treeErr}`);
  const rootHash = tree.rootHash();

  // 3. Upload: This triggers a MetaMask popup for the Flow contract transaction
  // This step IS the on-chain logging.
  const [tx, uploadErr] = await indexer.upload(
    zgBlob,
    process.env.NEXT_PUBLIC_0G_EVM_RPC!,
    signer
  );

  if (uploadErr) throw new Error(`Upload Error: ${uploadErr}`);

  return { rootHash, txHash: tx };
}