import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const organization = await client.organizations.create({
  name: "SandBank"
});

const user = await client.users.create({
  organizationId: organization.id,
  externalUserId: "sandbank-user-000001"
});

const wallet = await client.wallets.create({
  organizationId: organization.id,
  ownerType: "user",
  ownerId: user.id
});

const address = await client.wallets.createAddress(wallet.id, {
  organizationId: organization.id,
  assetCode: "USDC",
  networkCode: "sandbox-base-sepolia"
});

console.log({ organization, user, wallet, address });
