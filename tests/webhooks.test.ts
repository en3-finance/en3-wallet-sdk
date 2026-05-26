import { describe, expect, it } from "vitest";
import {
  En3Client,
  En3WebhookVerificationError,
  createSandboxWebhookSignature,
  verifySandboxWebhookSignature
} from "../src/index.js";

const secret = "sandbox-webhook-secret";

describe("sandbox webhook signatures", () => {
  it("verifies a valid HMAC signature", () => {
    const rawBody = webhookBody();
    const timestamp = new Date().toISOString();
    const signature = createSandboxWebhookSignature({ rawBody, timestamp, secret });

    const event = verifySandboxWebhookSignature({
      rawBody,
      secret,
      headers: headers(timestamp, `sha256=${signature}`)
    });

    expect(event).toMatchObject({
      id: "evt_001",
      type: "transaction.settled",
      organizationId: "org_001"
    });
  });

  it("is available from client.webhooks.verifySignature", () => {
    const rawBody = webhookBody();
    const timestamp = new Date().toISOString();
    const signature = createSandboxWebhookSignature({ rawBody, timestamp, secret });
    const client = new En3Client({
      apiKey: "sandbox-token",
      baseUrl: "http://localhost:8787",
      environment: "local",
      fetch: async () => new Response("{}")
    });

    expect(
      client.webhooks.verifySignature({
        rawBody,
        secret,
        headers: headers(timestamp, signature)
      })
    ).toMatchObject({ id: "evt_001" });
  });

  it("parses webhook events without verifying signatures", () => {
    const client = new En3Client({
      apiKey: "sandbox-token",
      baseUrl: "http://localhost:8787",
      environment: "local",
      fetch: async () => new Response("{}")
    });

    expect(client.webhooks.parseEvent(webhookBody())).toMatchObject({
      id: "evt_001",
      type: "transaction.settled"
    });
  });

  it("fails closed for invalid signatures, stale timestamps, missing headers, and malformed payloads", () => {
    const rawBody = webhookBody();
    const timestamp = new Date().toISOString();

    expect(() =>
      verifySandboxWebhookSignature({
        rawBody,
        secret,
        headers: headers(timestamp, "0".repeat(64))
      })
    ).toThrow(En3WebhookVerificationError);

    expect(() =>
      verifySandboxWebhookSignature({
        rawBody,
        secret,
        toleranceSeconds: 300,
        headers: headers("2020-01-01T00:00:00Z", createSandboxWebhookSignature({ rawBody, timestamp: "2020-01-01T00:00:00Z", secret }))
      })
    ).toThrow(En3WebhookVerificationError);

    expect(() =>
      verifySandboxWebhookSignature({
        rawBody,
        secret,
        headers: {
          "En3-Event-Id": "evt_001",
          "En3-Event-Type": "transaction.settled",
          "En3-Event-Timestamp": timestamp
        }
      })
    ).toThrow(En3WebhookVerificationError);

    expect(() =>
      verifySandboxWebhookSignature({
        rawBody: "{",
        secret,
        headers: headers(timestamp, createSandboxWebhookSignature({ rawBody: "{", timestamp, secret }))
      })
    ).toThrow(En3WebhookVerificationError);
  });
});

function headers(timestamp: string, signature: string) {
  return {
    "En3-Event-Id": "evt_001",
    "En3-Event-Type": "transaction.settled",
    "En3-Event-Timestamp": timestamp,
    "En3-Signature": signature
  };
}

function webhookBody(): string {
  return JSON.stringify({
    id: "evt_001",
    type: "transaction.settled",
    createdAt: "2026-05-25T12:00:00Z",
    organizationId: "org_001",
    transactionId: "txn_001",
    walletId: "wallet_001",
    status: "settled",
    assetCode: "USDC",
    amount: "12500.00",
    networkCode: "sandbox-base-sepolia"
  });
}
