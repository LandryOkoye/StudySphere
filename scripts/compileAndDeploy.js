import fs from 'fs';
import solc from 'solc';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
    console.log("Reading contract source...");
    const source = fs.readFileSync('contracts/StudySphereVerification.sol', 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'StudySphereVerification.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    console.log("Compiling with solc...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        let hasError = false;
        output.errors.forEach((err) => {
            console.error(err.formattedMessage);
            if (err.severity === 'error') hasError = true;
        });
        if (hasError) throw new Error("Compilation failed.");
    }

    const contract = output.contracts['StudySphereVerification.sol'].StudySphereVerification;
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    const rpcUrl = process.env.NEXT_PUBLIC_0G_EVM_RPC || "https://evmrpc-testnet.0g.ai";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    let pk = (process.env.PRIVATE_KEY || "").trim();
    if (!pk.startsWith("0x")) pk = "0x" + pk;
    const wallet = new ethers.Wallet(pk, provider);

    console.log("Deploying contract with account:", wallet.address);

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy();
    await deployedContract.waitForDeployment();

    const address = await deployedContract.getAddress();
    console.log("Contract deployed to:", address);

    fs.writeFileSync('lib/contractData.json', JSON.stringify({
        address: address,
        abi: abi
    }, null, 2));
    console.log("Wrote lib/contractData.json for frontend integration!");
}

main().catch((err) => {
    console.error("Error during deployment:", err);
    process.exit(1);
});
