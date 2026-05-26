import { En3Client, parseWebhookEvent } from "../src";

const client = new En3Client({
  baseUrl: "https://sandbox.api.en3.example",
  token: process.env.EN3_SANDBOX_TOKEN ?? "sandbox-token"
});

const wallet = await client.createWallet({
  organizationId: "org_sandbox_001",
  ownerType: "user",
  ownerId: "user_001"
});

await client.createAddress(wallet.id, {
  network: "base-sepolia",
  asset: "USDC"
});

const transaction = await client.submitTransaction({
  organizationId: "org_sandbox_001",
  walletId: wallet.id,
  asset: "USDC",
  amount: "12500.00",
  network: "base-sepolia",
  destinationAddress: "0x1111111111111111111111111111111111111111",
  idempotencyKey: "partner-txn-0001"
});

const simulation = await client.simulateTransaction(transaction.id);

if (simulation.result === "approval_required") {
  await client.approveTransaction(transaction.id, {
    decidedBy: "admin_001",
    decision: "approve",
    note: "Sandbox approval for reference bank flow."
  });
}

const event = parseWebhookEvent(JSON.stringify({
  id: "evt_001",
  type: "transaction.settled",
  createdAt: "2026-05-25T12:00:00Z",
  organizationId: "org_sandbox_001"
}));

console.log({ transactionId: transaction.id, eventType: event.type });
