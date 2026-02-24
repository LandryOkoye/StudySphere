import { ethers } from 'ethers';
import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        console.log("Initializing Broker...");
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_0G_EVM_RPC);
        let pk = (process.env.PRIVATE_KEY || "").trim();
        if (!pk.startsWith("0x")) pk = "0x" + pk;
        const wallet = new ethers.Wallet(pk, provider);
        const broker = await createZGComputeNetworkBroker(wallet);

        console.log("Listing services...");
        const services = await broker.inference.listService();
        console.log("Services:", services);

        const chatbotServices = services.filter((s) => s.serviceType === 'chatbot');
        if (chatbotServices.length === 0) {
            console.log("No chatbot services found.");
            return;
        }

        const providerAddress = chatbotServices[0].provider;
        console.log("Found provider:", providerAddress);

        console.log("Depositing Fund into Ledger...");
        try {
            // Need to deposit at least 0.1 A0GI (100000000000000000)
            await broker.ledger.depositFund(0.2); // Using 0.2 A0GI directly
        } catch (e) { console.log(e.message) }

        console.log("Transferring funds to provider... 0.05 A0GI");
        try {
            await broker.ledger.transferFund(providerAddress, 'inference', ethers.parseEther("0.05"));
        } catch (e) { console.log(e.message) }

        console.log("Acknowledging provider...");
        try {
            await broker.inference.acknowledgeProviderSigner(providerAddress);
        } catch (e) {
            console.log("Already acknowledged or error:", e.message);
        }

        console.log("Getting metadata...");
        const meta = await broker.inference.getServiceMetadata(providerAddress);
        console.log("Metadata:", meta);

        console.log("Getting headers...");
        const headers = await broker.inference.getRequestHeaders(providerAddress);
        console.log("Headers:", Object.keys(headers));

        console.log("Sending Inference Request...");
        const response = await fetch(`${meta.endpoint}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify({
                model: meta.model,
                messages: [{ role: "user", content: "Hello!" }]
            })
        });

        const rawText = await response.text();
        console.log("Status:", response.status);
        console.log("Raw Output:", rawText);

    } catch (error) {
        console.error("FATAL ERROR:", error);
    }
}

main();
