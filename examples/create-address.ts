import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const walletId = process.env.EN3_SANDBOX_WALLET_ID ?? "wallet_001";

const address = await client.wallets.createAddress(walletId, {
  network: "base-sepolia",
  asset: "USDC"
});

console.log({ address });
