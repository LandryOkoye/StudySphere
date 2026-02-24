import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import type { WalletClient } from 'viem';

export function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    if (!account || !chain) {
        return null;
    }
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new BrowserProvider(transport, network);
    const signer = new JsonRpcSigner(provider, account.address);
    return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: walletClient } = useWalletClient({ chainId });
    return useMemo(
        () => (walletClient ? walletClientToSigner(walletClient) : undefined),
        [walletClient]
    );
}