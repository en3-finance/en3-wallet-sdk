import type { TransactionStatus, WebhookEventType } from "./types";

export const transactionStatuses: TransactionStatus[] = [
  "submitted",
  "simulated",
  "requires_approval",
  "approved",
  "broadcast",
  "settled",
  "failed"
];

export const webhookEventTypes: WebhookEventType[] = [
  "wallet.created",
  "address.created",
  "transaction.submitted",
  "transaction.simulated",
  "transaction.requires_approval",
  "transaction.approved",
  "transaction.broadcast",
  "transaction.settled",
  "transaction.failed",
  "risk.review_required",
  "reconciliation.report_updated",
  "audit.event_recorded"
];
