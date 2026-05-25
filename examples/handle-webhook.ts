import type { WebhookEvent } from "../src";

export function handleWebhook(event: WebhookEvent) {
  switch (event.type) {
    case "wallet.created":
    case "address.created":
    case "transaction.submitted":
    case "transaction.requires_approval":
    case "transaction.approved":
    case "transaction.broadcast":
    case "transaction.settled":
    case "transaction.failed":
    case "risk.review_required":
      return { accepted: true, eventId: event.id };
    default:
      return { accepted: false, eventId: event.id };
  }
}
