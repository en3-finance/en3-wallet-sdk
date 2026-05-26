# Feature Specification: SandBank Demo SDK Integration Layer

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

## User Story

As an integration engineer, I can use `@en3/wallet-sdk` as the typed TypeScript integration layer for the SandBank demo and the public En3 sandbox API.

## Scope

- Typed resource groups for the public REST operations defined in `../en3-api-spec/openapi/en3-wallet-api.yaml`.
- Webhook parsing and sandbox/mock HMAC verification for public events defined in `../en3-api-spec/asyncapi/en3-webhooks.yaml`.
- SandBank examples under `examples/sandbank-*.ts`.
- No SDK methods for unsupported endpoints.

## Functional Requirements

- The SDK MUST expose `organizations.create()`, `users.create()`, `wallets.create()`, `wallets.get()`, `wallets.createAddress()`, `policies.create()`, `transactions.create()`, `transactions.simulate()`, `transactions.approve()`, `auditEvents.list()`, and `webhookEndpoints.create()`.
- The SDK MUST expose `webhooks.parseEvent()` and `webhooks.verifySignature()` for sandbox webhook payloads.
- The SDK MUST NOT expose a reconciliation report retrieval helper unless the OpenAPI contract defines a public endpoint for it.
- SDK request and response types MUST use the public OpenAPI field names, including `assetCode`, `networkCode`, policy thresholds, and simulation decision objects.
- Webhook event types MUST use only the public AsyncAPI event names.
- Deprecated audit, ledger-entry, and reconciliation-entry public event names MUST be absent.

## Acceptance Criteria

- TypeScript typecheck, build, and Vitest test suite pass.
- Required SandBank examples compile under the repository TypeScript config.
- A scan confirms forbidden public event names are absent from source, examples, README, reports, and this feature spec.
- A secret scan finds no real credentials.
