import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';

export async function POST(req: Request) {
    try {
        const { message, environmentHashes, useWebSearch } = await req.json();

        console.log("0G Compute API hit with message:", message);
        console.log("Environment Hashes Context:", environmentHashes);

        // Initialize Broker
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_0G_EVM_RPC!);
        let pk = (process.env.PRIVATE_KEY || "").trim();
        if (!pk.startsWith("0x")) pk = "0x" + pk;
        const wallet = new ethers.Wallet(pk, provider);
        const broker = await createZGComputeNetworkBroker(wallet);

        // Discover chatbot services
        const services = await broker.inference.listService();
        const chatbotServices = services.filter((s: any) => s.serviceType === 'chatbot');

        if (chatbotServices.length === 0) {
            throw new Error("No chatbot services found on the 0G network.");
        }

        // Pick the first available chatbot provider
        const providerAddress = chatbotServices[0].provider;

        // Auto-initialize Account & Funds for this specific Provider Node
        try {
            await broker.ledger.depositFund(0.2);
            await broker.ledger.transferFund(providerAddress, 'inference', ethers.parseEther("0.05"));
        } catch (e: any) {
            console.log("Account already funded or error funding:", e.message);
        }

        // Acknowledge Provider Signer (Required before first use)
        try {
            await broker.inference.acknowledgeProviderSigner(providerAddress);
        } catch (e) {
            console.log("Already acknowledged or error acknowledging:", e);
        }

        const { endpoint, model } = await broker.inference.getServiceMetadata(providerAddress);
        const headers = await broker.inference.getRequestHeaders(providerAddress);

        const messagesPayload = [
            { role: "system", content: "You are the StudySphere AI Assistant. Use the provided context hashes from 0G Storage to ground your answers. Be concise and helpful." },
            { role: "user", content: message }
        ];

        // Make inference request to the selected 0G Node
        const response = await fetch(`${endpoint}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers
            },
            body: JSON.stringify({
                model,
                messages: messagesPayload,
                // Passing custom context hashes (if the specific provider supports it via RAG extension)
                contextHashes: environmentHashes || [],
                tools: useWebSearch ? ["web_search"] : []
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`0G Compute Provider returned status: ${response.status} - ${errBody}`);
        }

        const rawData = await response.text();
        console.log("Raw 0G Compute Response:", rawData);

        const data = JSON.parse(rawData);
        const outputText = data.choices?.[0]?.message?.content || "No response generated.";

        return NextResponse.json({ text: outputText });

    } catch (error: any) {
        console.error("0G Compute Error:", error);
        return NextResponse.json(
            { error: "Failed to connect to 0G Compute network or perform inference.", details: error.message || error.toString() },
            { status: 500 }
        );
    }
}
