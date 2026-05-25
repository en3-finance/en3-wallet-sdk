import { En3Client } from "../src";

const client = new En3Client({
  baseUrl: "https://sandbox.api.en3.example",
  token: process.env.EN3_SANDBOX_TOKEN ?? "sandbox-token"
});

const transaction = await client.submitTransaction({
  organizationId: "org_sandbox_001",
  walletId: "wallet_001",
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
    note: "Sandbox approval for reference flow."
  });
}

console.log({ transaction, simulation });
