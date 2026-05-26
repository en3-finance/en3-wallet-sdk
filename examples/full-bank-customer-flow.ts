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

const address = await client.wallets.createAddress(wallet.id, {
  network: "base-sepolia",
  asset: "USDC"
});

const policy = await client.policies.create({
  organizationId: organization.id,
  name: "High value stablecoin transfer approval",
  rules: [
    {
      type: "transaction_amount",
      asset: "USDC",
      threshold: "10000.00",
      action: "require_approval"
    }
  ]
});

const transaction = await client.transactions.create({
  organizationId: organization.id,
  walletId: wallet.id,
  asset: "USDC",
  amount: "12500.00",
  network: "base-sepolia",
  destinationAddress: "0x1111111111111111111111111111111111111111",
  idempotencyKey: "partner-txn-0001"
});

const simulation = await client.transactions.simulate(transaction.id);
const approval =
  simulation.result === "approval_required"
    ? await client.transactions.approve(transaction.id, {
        decidedBy: "admin_001",
        decision: "approve",
        note: "Sandbox approval for reference flow."
      })
    : undefined;

const auditEvents = await client.auditEvents.list({
  organizationId: organization.id
});

console.log({
  organization,
  user,
  wallet,
  address,
  policy,
  transaction,
  simulation,
  approval,
  auditEvents
});
