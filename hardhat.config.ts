import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RPC_URL = process.env.NEXT_PUBLIC_0G_EVM_RPC || "https://evmrpc-testnet.0g.ai";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        zeroGTestnet: {
            url: RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "16602"),
        },
    },
};

export default config;
