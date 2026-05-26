import { webhookEventTypes } from "./contract";
import type { WebhookEvent } from "./types";

export function isKnownWebhookEventType(type: string): boolean {
  return webhookEventTypes.includes(type as WebhookEvent["type"]);
}

export function parseWebhookEvent(rawBody: string): WebhookEvent {
  const parsed = JSON.parse(rawBody) as WebhookEvent;
  if (!isKnownWebhookEventType(parsed.type)) {
    throw new Error(`Unknown En3 webhook event type: ${parsed.type}`);
  }
  return parsed;
}
