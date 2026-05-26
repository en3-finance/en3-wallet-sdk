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

const policy = await client.policies.create({
  organizationId: organization.id,
  name: "SandBank approval threshold",
  approvalThreshold: "10000.00",
  blockThreshold: "50000.00"
});

const transaction = await client.transactions.create({
  organizationId: organization.id,
  walletId: wallet.id,
  type: "withdrawal",
  assetCode: "USDC",
  networkCode: "sandbox-base-sepolia",
  amount: "12500.00",
  destinationAddress: "sandbox_destination_sandbank_000001",
  idempotencyKey: "sandbank-txn-000001"
});

const simulation = await client.transactions.simulate(transaction.id);
const approval =
  simulation.policyDecision.outcome === "approval_required"
    ? await client.transactions.approve(transaction.id, {
        decidedBy: "usr_sandbox_operator_000001",
        decision: "approve",
        note: "Sandbox approval for SandBank demo flow."
      })
    : undefined;

const auditEvents = await client.auditEvents.list({ organizationId: organization.id });
const webhookEndpoint = await client.webhookEndpoints.create({
  organizationId: organization.id,
  url: "https://webhooks.sandbank.example/en3",
  events: ["transaction.settled", "reconciliation.updated", "audit.event_created"]
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
  auditEvents,
  webhookEndpoint
});
