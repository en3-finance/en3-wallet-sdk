import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const transaction = await client.transactions.create({
  organizationId: process.env.EN3_SANDBOX_ORGANIZATION_ID ?? "org_sandbox_000001",
  walletId: process.env.EN3_SANDBOX_WALLET_ID ?? "wallet_001",
  type: "withdrawal",
  assetCode: "USDC",
  amount: "12500.00",
  networkCode: "sandbox-base-sepolia",
  destinationAddress: "sandbox_destination_sandbank_000001",
  idempotencyKey: "sandbank-txn-000001"
});

const simulation = await client.transactions.simulate(transaction.id);

console.log({ transaction, simulation });
