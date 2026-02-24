import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    if (!deployer) {
        throw new Error("No deployer account found. Check your private key in .env.local");
    }

    console.log("Deploying contracts with the account:", deployer.address);

    const factory = await ethers.getContractFactory("StudySphereVerification");
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("StudySphereVerification deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
