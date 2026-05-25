import { En3Client } from "../src";

const client = new En3Client({
  baseUrl: "https://sandbox.api.en3.example",
  token: process.env.EN3_SANDBOX_TOKEN ?? "sandbox-token"
});

const wallet = await client.createWallet({
  organizationId: "org_sandbox_001",
  ownerType: "user",
  ownerId: "user_001"
});

const address = await client.createAddress(wallet.id, {
  network: "base-sepolia",
  asset: "USDC"
});

console.log({ wallet, address });
