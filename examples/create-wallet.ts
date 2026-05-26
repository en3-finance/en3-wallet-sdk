import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const organization = await client.organizations.create({
  name: "Reference Bank"
});

const user = await client.users.create({
  organizationId: organization.id,
  externalUserId: "core-user-001"
});

const wallet = await client.wallets.create({
  organizationId: organization.id,
  ownerType: "user",
  ownerId: user.id
});

console.log({ organization, user, wallet });
