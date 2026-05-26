import { En3Client } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const transactionId = process.env.EN3_SANDBOX_TRANSACTION_ID ?? "txn_001";

const approval = await client.transactions.approve(transactionId, {
  decidedBy: process.env.EN3_SANDBOX_ADMIN_ID ?? "admin_001",
  decision: "approve",
  note: "Sandbox approval for reference flow."
});

console.log({ approval });
