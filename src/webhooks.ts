import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
import { En3WebhookVerificationError } from "./errors.js";
import type {
  CreateSandboxWebhookSignatureInput,
  WebhookEvent,
  WebhookHeaders,
  WebhookVerificationInput
} from "./types.js";

const DEFAULT_TOLERANCE_SECONDS = 300;

export function createSandboxWebhookSignature(input: CreateSandboxWebhookSignatureInput): string {
  const rawBody = rawBodyToString(input.rawBody);
  return createHmac("sha256", input.secret).update(`${input.timestamp}.${rawBody}`).digest("hex");
}

export function verifySandboxWebhookSignature<TEvent extends WebhookEvent = WebhookEvent>(
  input: WebhookVerificationInput
): TEvent {
  if (!input.secret) {
    throw new En3WebhookVerificationError("Webhook secret is required", {
      code: "webhook_secret_required"
    });
  }

  const eventId = requiredHeader(input.headers, "En3-Event-Id");
  const eventType = requiredHeader(input.headers, "En3-Event-Type");
  const timestamp = requiredHeader(input.headers, "En3-Event-Timestamp");
  const signature = normalizeSignature(requiredHeader(input.headers, "En3-Signature"));
  const toleranceSeconds = input.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;

  if (toleranceSeconds < 0) {
    throw new En3WebhookVerificationError("Webhook timestamp tolerance must be non-negative", {
      code: "invalid_timestamp_tolerance"
    });
  }

  assertTimestampWithinTolerance(timestamp, toleranceSeconds);

  const expected = createSandboxWebhookSignature({
    rawBody: input.rawBody,
    timestamp,
    secret: input.secret
  });

  if (!safeEqualHex(signature, expected)) {
    throw new En3WebhookVerificationError("Webhook signature verification failed", {
      code: "invalid_webhook_signature"
    });
  }

  const event = parseWebhookEvent<TEvent>(rawBodyToString(input.rawBody));

  if (event.id !== eventId) {
    throw new En3WebhookVerificationError("Webhook event id header does not match payload", {
      code: "webhook_event_id_mismatch"
    });
  }

  if (event.type !== eventType) {
    throw new En3WebhookVerificationError("Webhook event type header does not match payload", {
      code: "webhook_event_type_mismatch"
    });
  }

  return event;
}

function requiredHeader(headers: WebhookHeaders, name: string): string {
  const value = getHeader(headers, name);

  if (!value) {
    throw new En3WebhookVerificationError(`Missing webhook header: ${name}`, {
      code: "missing_webhook_header"
    });
  }

  return value;
}

function getHeader(headers: WebhookHeaders, name: string): string | undefined {
  if (typeof Headers !== "undefined" && headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }

  const lowerName = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== lowerName || value === undefined) {
      continue;
    }

    return Array.isArray(value) ? value[0] : value;
  }

  return undefined;
}

function normalizeSignature(signature: string): string {
  const normalized = signature.startsWith("sha256=") ? signature.slice("sha256=".length) : signature;

  if (!/^[a-fA-F0-9]{64}$/.test(normalized)) {
    throw new En3WebhookVerificationError("Webhook signature must be a SHA-256 hex digest", {
      code: "malformed_webhook_signature"
    });
  }

  return normalized.toLowerCase();
}

function assertTimestampWithinTolerance(timestamp: string, toleranceSeconds: number): void {
  const timestampMs = parseTimestampMs(timestamp);
  const ageMs = Math.abs(Date.now() - timestampMs);

  if (ageMs > toleranceSeconds * 1000) {
    throw new En3WebhookVerificationError("Webhook timestamp is outside tolerance", {
      code: "webhook_timestamp_out_of_tolerance"
    });
  }
}

function parseTimestampMs(timestamp: string): number {
  if (/^\d+$/.test(timestamp)) {
    const numeric = Number(timestamp);
    return timestamp.length >= 13 ? numeric : numeric * 1000;
  }

  const parsed = Date.parse(timestamp);

  if (!Number.isFinite(parsed)) {
    throw new En3WebhookVerificationError("Webhook timestamp is invalid", {
      code: "invalid_webhook_timestamp"
    });
  }

  return parsed;
}

function safeEqualHex(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseWebhookEvent<TEvent extends WebhookEvent>(rawBody: string): TEvent {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody);
  } catch (error) {
    throw new En3WebhookVerificationError("Webhook payload is not valid JSON", {
      code: "invalid_webhook_payload",
      cause: error
    });
  }

  if (!isWebhookEvent(parsed)) {
    throw new En3WebhookVerificationError("Webhook payload is missing required event fields", {
      code: "invalid_webhook_event"
    });
  }

  return parsed as TEvent;
}

function isWebhookEvent(value: unknown): value is WebhookEvent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.type === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.organizationId === "string"
  );
}

function rawBodyToString(rawBody: string | Uint8Array): string {
  return typeof rawBody === "string" ? rawBody : Buffer.from(rawBody).toString("utf8");
}
