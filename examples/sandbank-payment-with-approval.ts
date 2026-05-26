import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const organizationId = process.env.EN3_SANDBOX_ORGANIZATION_ID ?? "org_sandbox_000001";
const walletId = process.env.EN3_SANDBOX_WALLET_ID ?? "wal_sandbox_000001";

const policy = await client.policies.create({
  organizationId,
  name: "SandBank approval threshold",
  approvalThreshold: "10000.00",
  blockThreshold: "50000.00"
});

const transaction = await client.transactions.create({
  organizationId,
  walletId,
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
        decidedBy: process.env.EN3_SANDBOX_OPERATOR_ID ?? "usr_sandbox_operator_000001",
        decision: "approve",
        note: "Sandbox approval for SandBank demo flow."
      })
    : undefined;

console.log({ policy, transaction, simulation, approval });
