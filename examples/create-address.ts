import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const walletId = process.env.EN3_SANDBOX_WALLET_ID ?? "wallet_001";

const address = await client.wallets.createAddress(walletId, {
  organizationId: process.env.EN3_SANDBOX_ORGANIZATION_ID ?? "org_sandbox_000001",
  networkCode: "sandbox-base-sepolia",
  assetCode: "USDC"
});

console.log({ address });
