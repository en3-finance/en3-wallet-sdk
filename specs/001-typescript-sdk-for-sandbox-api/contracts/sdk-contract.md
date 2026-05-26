# SDK Contract

## Client Construction

```ts
const client = new En3Client({
  apiKey: "sandbox-token",
  baseUrl: "https://sandbox.api.en3.example",
  environment: "sandbox"
});
```

Configuration:
- `apiKey`: required sandbox bearer token.
- `baseUrl`: required sandbox or local base URL.
- `environment`: `sandbox` or `local`.
- `fetch`: optional fetch-compatible implementation for tests/custom runtimes.

## Resource Methods

```ts
client.organizations.create(input)
client.users.create(input)
client.wallets.create(input)
client.wallets.get(walletId)
client.wallets.createAddress(walletId, input)
client.transactions.create(input)
client.transactions.simulate(transactionId)
client.transactions.approve(transactionId, input)
client.policies.create(input)
client.auditEvents.list({ organizationId })
client.webhookEndpoints.create(input)
client.webhooks.verifySignature(input)
```

Legacy convenience aliases may remain for compatibility:

```ts
client.createWallet(input)
client.createAddress(walletId, input)
client.submitTransaction(input)
client.simulateTransaction(transactionId)
client.approveTransaction(transactionId, input)
```

## Request Behavior

- Requests use `Authorization: Bearer <apiKey>`.
- JSON request bodies use `Content-Type: application/json`.
- Success responses parse JSON when present.
- Empty success responses return `undefined`.
- Non-2xx responses throw typed `En3ApiError` subclasses based on status.
- Network failures throw `En3NetworkError`.

## Webhook Verification Behavior

Input:

```ts
client.webhooks.verifySignature({
  rawBody,
  headers,
  secret,
  toleranceSeconds: 300
});
```

Sandbox HMAC model:
- Required headers: `En3-Event-Id`, `En3-Event-Type`,
  `En3-Event-Timestamp`, `En3-Signature`.
- Signed content: `<timestamp>.<rawBody>`.
- Algorithm: HMAC-SHA256.
- Signature format: `sha256=<hex>` or raw hex.
- Invalid headers, stale timestamps, malformed JSON, and mismatched signatures
  throw `En3WebhookVerificationError`.

This helper is mock/sandbox reference behavior only.
