import { En3Client, type WebhookEvent } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

export function verifyWebhook(rawBody: string, headers: Headers): WebhookEvent {
  return client.webhooks.verifySignature({
    rawBody,
    headers,
    secret: process.env.EN3_SANDBOX_WEBHOOK_SECRET ?? "sandbox-webhook-secret"
  });
}

export function handleWebhook(event: WebhookEvent) {
  switch (event.type) {
    case "wallet.created":
    case "address.created":
    case "transaction.submitted":
    case "transaction.simulated":
    case "transaction.requires_approval":
    case "transaction.approved":
    case "transaction.broadcast":
    case "transaction.settled":
    case "transaction.failed":
    case "risk.review_required":
    case "reconciliation.report_updated":
    case "audit.event_recorded":
      return { accepted: true, eventId: event.id };
    default:
      return { accepted: false, eventId: event.id };
  }
}
