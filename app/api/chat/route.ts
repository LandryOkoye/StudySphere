import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';

// Cache to prevent hitting the unstable testnet RPC on every single chat message
let cachedServiceInfo: { endpoint: string, model: string, address: string, headers: Record<string, string> } | null = null;
let brokerInstance: any = null;

async function getBroker() {
    if (brokerInstance) return brokerInstance;
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_0G_EVM_RPC!);
    let pk = (process.env.PRIVATE_KEY || "").trim();
    if (!pk.startsWith("0x")) pk = "0x" + pk;
    const wallet = new ethers.Wallet(pk, provider);
    brokerInstance = await createZGComputeNetworkBroker(wallet);
    return brokerInstance;
}

export async function POST(req: Request) {
    try {
        const { message, environmentHashes, useWebSearch } = await req.json();

        console.log("0G Compute API hit with message:", message);
        console.log("Environment Hashes Context:", environmentHashes);

        const broker = await getBroker();

        if (!cachedServiceInfo) {
            console.log("Fetching service info from 0G Network...");

            let providerAddress = "";
            let endpoint = "";
            let model = "";
            let headers: Record<string, string> = {};

            let attempts = 0;
            let success = false;
            let lastError: any = null;

            while (attempts < 3 && !success) {
                try {
                    attempts++;
                    console.log(`Discovery attempt ${attempts}...`);
                    // Discover chatbot services
                    const services = await broker.inference.listService();
                    const chatbotServices = services.filter((s: any) => s.serviceType === 'chatbot');

                    if (chatbotServices.length === 0) {
                        throw new Error("No chatbot services found on the 0G network.");
                    }

                    // Pick the first available chatbot provider
                    providerAddress = chatbotServices[0].provider;

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
                        console.log("Already acknowledged or error acknowledging", e);
                    }

                    const metadata = await broker.inference.getServiceMetadata(providerAddress);
                    endpoint = metadata.endpoint;
                    model = metadata.model;
                    headers = await broker.inference.getRequestHeaders(providerAddress);

                    success = true;
                } catch (err: any) {
                    console.log("Error during 0G node discovery:", err.message || err);
                    lastError = err;
                    if (attempts < 3) {
                        await new Promise(res => setTimeout(res, 2000)); // wait 2s
                    }
                }
            }

            if (!success) {
                throw lastError || new Error("Failed to discover 0G services after 3 attempts");
            }

            cachedServiceInfo = { endpoint, model, address: providerAddress, headers };
        } else {
            console.log("Using cached 0G service info.");
        }

        const { endpoint, model, headers } = cachedServiceInfo;

        const messagesPayload = [
            { role: "system", content: "You are the StudySphere AI Assistant. Use the provided context hashes from 0G Storage to ground your answers. Be concise and helpful." },
            { role: "user", content: message }
        ];

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
                contextHashes: environmentHashes || []
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
