import { En3Client, type WebhookEvent } from "../src/index.js";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

export function parseSandBankWebhook(rawBody: string): WebhookEvent {
  return client.webhooks.parseEvent(rawBody);
}

export function verifySandBankWebhook(rawBody: string, headers: Headers): WebhookEvent {
  return client.webhooks.verifySignature({
    rawBody,
    headers,
    secret: process.env.EN3_SANDBOX_WEBHOOK_SECRET ?? "sandbox-webhook-secret"
  });
}

export function handleSandBankWebhook(event: WebhookEvent) {
  switch (event.type) {
    case "transaction.requires_approval":
    case "transaction.approved":
    case "transaction.signing":
    case "transaction.signed":
    case "transaction.broadcast":
    case "transaction.settled":
    case "reconciliation.updated":
    case "audit.event_created":
      return { accepted: true, eventId: event.id, type: event.type };
    default:
      return { accepted: true, eventId: event.id, type: event.type };
  }
}
