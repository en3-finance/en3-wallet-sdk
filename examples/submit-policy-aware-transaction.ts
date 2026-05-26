import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const transaction = await client.transactions.create({
  organizationId: process.env.EN3_SANDBOX_ORGANIZATION_ID ?? "org_sandbox_001",
  walletId: process.env.EN3_SANDBOX_WALLET_ID ?? "wallet_001",
  asset: "USDC",
  amount: "12500.00",
  network: "base-sepolia",
  destinationAddress: "0x1111111111111111111111111111111111111111",
  idempotencyKey: "partner-txn-0001"
});

const simulation = await client.transactions.simulate(transaction.id);

console.log({ transaction, simulation });
