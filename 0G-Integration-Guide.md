# StudySphere - 0G Integration Steps Guide

This guide outlines the exact, practical steps required to integrate ZeroGravity (0G) services (Storage and Compute) into the StudySphere TypeScript Next.js application. Since 0G SDKs are TypeScript-compatible, they can fit natively into this codebase.

## Overview of 0G Services used in StudySphere
1. **0G Storage**: Decentralized storage for imported documents (PDFs, Images, Notes, Google Drive raw content) and YouTube transcripts.
2. **0G Compute**: RAG pipelines, contextual Web Search layer, and AI chat endpoints (summarization, quiz generation, flashcard extraction).
3. **Smart Contracts (EVM)**: On-chain ledger logging Environment IDs, Wallet Owners, File Hashes (from 0G Storage), and Verifiable Quiz Scores.

---

## 🏗️ 1. Integrating 0G Storage (Document Uploads)

StudySphere processes local files, cloud files, and web links. Upon parsing, files are sent to 0G Storage.

### Setup
Install the official 0G Storage SDK:
```bash
npm install @0glabs/0g-storage-client ethers
```

### Implementation Steps
1. **Initialize the Storage Client**: 
   Create a utility `lib/0g-storage.ts` to export a configured client. Use the user's connected wallet (ethers.js provider) to sign the transaction.
2. **Process and Upload**: 
   Modify `components/document-upload.tsx`. When a file is uploaded (or URL parsed), convert it to an ArrayBuffer or File object.
3. **Upload & Get Hash**:
   Call the configured `upload` function. 0G Storage will return a verifiable Root Hash.
4. **Log to Smart Contract**: 
   Send a transaction on-chain linking the user's `EnvironmentID` to the `0G_Storage_RootHash`.

```typescript
import { ZgStorageClient } from '@0glabs/0g-storage-client';
import { ethers } from 'ethers';

export async function uploadTo0G(fileBuffer: Buffer, walletSigner: ethers.Signer) {
    const client = new ZgStorageClient(process.env.NEXT_PUBLIC_0G_STORAGE_RPC);
    
    // Upload standard file to 0G decentralized storage network
    const result = await client.upload(fileBuffer, walletSigner);
    return result.rootHash; // Save this hash on-chain!
}
```

---

## 🧠 2. Integrating 0G Compute (AI Engine & Web Search)

0G Compute serves as the decentralized AI execution layer for StudySphere. This handles context-aware chat, web scraping, and study tool generation.

### Setup
Check for the 0G Serving/Compute SDK or the established REST endpoints provided by the 0G Compute nodes.
```bash
npm install @0glabs/0g-serving-sdk
```

### Implementation Steps
1. **RAG Pipeline (Retrieval-Augmented Generation)**:
   When a user opens an environment, StudySphere tells the 0G Compute node to load the context using the `RootHash` array associated with the environment.
2. **Web Search Layer**:
   If the "Web Search" toggle is enabled in `ai-chat.tsx`, modify the prompt payload sent to 0G Compute to instruct the AI agent to execute live search tool calls.
3. **Update `handleSendMessage` in `workspace.tsx`**:
   Replace the `generateAIResponse` mock function with an API call to your Next.js Route Handler (e.g., `app/api/chat/route.ts`).

```typescript
// app/api/chat/route.ts
import { ZgComputeClient } from '@0glabs/0g-serving-sdk';

export async function POST(req: Request) {
    const { message, environmentHashes, useWebSearch } = await req.json();
    
    const computeClient = new ZgComputeClient(process.env.0G_COMPUTE_ENDPOINT);
    
    const response = await computeClient.inference({
        model: "llama-3-8b-instruct", // or specified 0G compute model
        messages: [
            { role: "system", content: "You are the StudySphere AI Assistant..." },
            { role: "user", content: message }
        ],
        contextHashes: environmentHashes, // Tells 0G to load these files from 0G Storage into RAG
        tools: useWebSearch ? ["web_search"] : [] 
    });

    return Response.json({ text: response.output });
}
```

---

## 🔗 3. Smart Contract Verification (Verifiable Learning)

To prove a student actually learned something, StudySphere logs quiz scores on-chain.

### Implementation Steps
1. Deploy an EVM-compatible contract on the 0G Network (or supported L1/L2).
2. The contract should have a method: `recordQuizScore(string environmentId, uint8 score)`.
3. In `quiz-view.tsx`, when the user hits "View Results", prompt their wallet to sign a transaction logging their score.

```typescript
// Example ethers.js integration after Quiz completion
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
const tx = await contract.recordQuizScore(environment.id, finalScore);
await tx.wait(); // Confirmed verifiable learning!
```

---

## 🚀 Next Steps for Development
1. Replace simulated `setInterval` progress bars in `document-upload.tsx` with actual `0G Storage Upload` progress events.
2. Hook up Google Drive API / YouTube Transcript NPM libraries in server actions to fetch raw text before piping it to 0G Storage.
3. Add `ethers.js` or `wagmi` / `viem` for Wallet Connection on the Auth Screen to replace the mock `handleConnect()`.
