# En3 Wallet SDK

`@en3/wallet-sdk` is a TypeScript SDK for the public En3 Wallet-as-a-Service
sandbox API contract.

Status: public sandbox/reference artifact. This repository documents and exercises
the En3 integration surface for partner engineers. Production cryptography,
signing orchestration, policy enforcement, risk logic, ledger infrastructure,
treasury execution, and customer deployments are private by design.

## What This SDK Is

- A typed client for the public sandbox REST contract in
  [`en3-api-spec`](https://github.com/en3-finance/en3-api-spec).
- A set of copy-pasteable sandbox examples for organization, user, wallet,
  address, transaction, approval, policy, audit, and webhook flows.
- A mock/reference webhook HMAC verification helper for sandbox payloads.

## What This SDK Is Not

This SDK does not perform production signing, custody, private key management,
seed phrase handling, policy enforcement, ledger updates, treasury execution,
compliance-vendor calls, or customer deployment operations.

It does not claim production readiness, audited MPC/TSS, regulatory approval,
compliance certification, live vendor integrations, or customer deployments.

## Install

```bash
pnpm add @en3/wallet-sdk
```

For local development in this repository:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## Quickstart

```ts
import { En3Client } from "@en3/wallet-sdk";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const organization = await client.organizations.create({
  name: "Reference Bank"
});

const user = await client.users.create({
  organizationId: organization.id,
  externalUserId: "core-user-001"
});

const wallet = await client.wallets.create({
  organizationId: organization.id,
  ownerType: "user",
  ownerId: user.id
});

const address = await client.wallets.createAddress(wallet.id, {
  network: "base-sepolia",
  asset: "USDC"
});

console.log({ organization, user, wallet, address });
```

## Client Configuration

```ts
const client = new En3Client({
  apiKey: "sandbox-token",
  baseUrl: "https://sandbox.api.en3.example",
  environment: "sandbox" // or "local"
});
```

The SDK sends `Authorization: Bearer <apiKey>` and JSON request bodies. Tests can
inject a custom `fetch` implementation through the client config.

## Resource Methods

```ts
client.organizations.create(input);
client.users.create(input);
client.wallets.create(input);
client.wallets.get(walletId);
client.wallets.createAddress(walletId, input);
client.transactions.create(input);
client.transactions.simulate(transactionId);
client.transactions.approve(transactionId, input);
client.policies.create(input);
client.auditEvents.list({ organizationId });
client.webhookEndpoints.create(input);
client.webhooks.verifySignature(input);
```

Compatibility aliases are also available:

```ts
client.createWallet(input);
client.createAddress(walletId, input);
client.submitTransaction(input);
client.simulateTransaction(transactionId);
client.approveTransaction(transactionId, input);
```

## Errors

All SDK errors extend `En3Error`.

- `En3ConfigurationError`
- `En3ApiError`
- `En3AuthenticationError`
- `En3AuthorizationError`
- `En3ValidationError`
- `En3RateLimitError`
- `En3ServerError`
- `En3NetworkError`
- `En3WebhookVerificationError`

```ts
import { En3ValidationError } from "@en3/wallet-sdk";

try {
  await client.wallets.create({
    organizationId: "org_sandbox_001",
    ownerType: "user",
    ownerId: "user_001"
  });
} catch (error) {
  if (error instanceof En3ValidationError) {
    console.error(error.status, error.code, error.requestId);
  }
}
```

## Sandbox Webhooks

Webhook verification is mock/sandbox reference behavior only. It uses the public
sandbox header shape from `en3-api-spec`:

- `En3-Event-Id`
- `En3-Event-Type`
- `En3-Event-Timestamp`
- `En3-Signature`

The helper signs `<timestamp>.<rawBody>` with HMAC-SHA256 and accepts
`sha256=<hex>` or raw hex signatures.

```ts
const event = client.webhooks.verifySignature({
  rawBody,
  headers,
  secret: process.env.EN3_SANDBOX_WEBHOOK_SECRET ?? "sandbox-webhook-secret"
});
```

## Examples

- [`examples/create-wallet.ts`](examples/create-wallet.ts)
- [`examples/create-address.ts`](examples/create-address.ts)
- [`examples/submit-policy-aware-transaction.ts`](examples/submit-policy-aware-transaction.ts)
- [`examples/approve-transaction.ts`](examples/approve-transaction.ts)
- [`examples/handle-webhook.ts`](examples/handle-webhook.ts)
- [`examples/full-bank-customer-flow.ts`](examples/full-bank-customer-flow.ts)

## Related En3 Repositories

- [`en3-api-spec`](https://github.com/en3-finance/en3-api-spec)
- [`en3-reference-bank`](https://github.com/en3-finance/en3-reference-bank)

## Security

See [SECURITY.md](SECURITY.md). Do not put production credentials, private keys,
seed phrases, real RPC URLs, customer data, or internal deployment configuration in
this repository.
