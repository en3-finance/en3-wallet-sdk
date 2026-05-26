# Data Model: SDK for Sandbox API

## ClientConfig

- `apiKey`: sandbox bearer token placeholder supplied by the caller.
- `baseUrl`: sandbox or local API base URL, normalized without trailing slash.
- `environment`: `sandbox` or `local`.
- `fetch`: optional injected fetch implementation for tests/custom runtimes.

Validation:
- `apiKey` and `baseUrl` are required non-empty strings.
- `environment` must be `sandbox` or `local`.

## Organization

- `id`: sandbox organization identifier.
- `name`: organization display name.
- `status`: `sandbox_active` or `suspended`.
- `createdAt`: ISO timestamp.

Create request:
- `name`.

## User

- `id`, `organizationId`, `externalUserId`, `status`, `createdAt`.
- Status is `active`, `restricted`, or `closed`.

Create request:
- `organizationId`, `externalUserId`.

## Wallet

- `id`, `organizationId`, `ownerType`, `ownerId`, `status`, `balances`.
- `ownerType`: `user`, `treasury`, or `system`.
- `status`: `active`, `frozen`, or `closed`.
- `balances`: asset/network/available/pending entries.

Create request:
- `organizationId`, `ownerType`, `ownerId`.

## Address

- `id`, `walletId`, `network`, `address`, `status`.
- `status`: `active` or `archived`.

Create request:
- `network`, `asset`.

## Transaction

- `id`, `organizationId`, `walletId`, `type`, `asset`, `amount`, `network`,
  optional `destinationAddress`, `status`, optional `policyResult`, `createdAt`.
- `type`: `deposit`, `withdrawal`, or `transfer`.
- `status`: `submitted`, `simulated`, `requires_approval`, `approved`,
  `broadcast`, `settled`, or `failed`.

Create request:
- `organizationId`, `walletId`, `asset`, `amount`, `network`,
  `destinationAddress`, optional `idempotencyKey`.

## TransactionSimulation

- `transactionId`, `result`, `estimatedFee`, `policyResult`, optional
  `riskSignals`.
- `result`: `allowed`, `approval_required`, `review_required`, or `blocked`.

## Approval

- `id`, `transactionId`, `status`, `decidedBy`, optional `note`, `decidedAt`.
- `status`: `approved` or `rejected`.

Approve request:
- `decidedBy`, `decision` (`approve` or `reject`), optional `note`.

## Policy

- `id`, `organizationId`, `name`, `status`, `rules`.
- `status`: `draft`, `active`, or `disabled`.
- Rules remain flexible sandbox objects matching the public contract.

Create request:
- `organizationId`, `name`, `rules`.

## AuditEvent

- `id`, `organizationId`, `actorType`, optional `actorId`, `action`,
  `resourceType`, `resourceId`, `createdAt`.
- `actorType`: `user`, `admin`, or `system`.

List request:
- optional `organizationId` query parameter.

## WebhookEndpoint

- `id`, `organizationId`, `url`, `events`, `status`.
- `status`: `active` or `disabled`.

Create request:
- `organizationId`, `url`, `events`.

## WebhookEvent

- Base fields: `id`, `type`, `createdAt`, `organizationId`.
- Event-specific fields follow `../en3-api-spec/asyncapi/en3-webhooks.yaml`.

Verification input:
- raw request body string or bytes.
- headers containing `En3-Event-Id`, `En3-Event-Type`,
  `En3-Event-Timestamp`, and `En3-Signature`.
- caller-provided sandbox secret.
- optional timestamp tolerance seconds.

## SDK Errors

- `En3Error`: base SDK error.
- `En3ConfigurationError`: invalid client config.
- `En3ApiError`: non-2xx HTTP response with status, code, request id, and body.
- `En3AuthenticationError`: 401 response.
- `En3AuthorizationError`: 403 response.
- `En3ValidationError`: 400 or 422 response.
- `En3RateLimitError`: 429 response.
- `En3ServerError`: 5xx response.
- `En3NetworkError`: failed fetch/network request.
- `En3WebhookVerificationError`: invalid webhook headers, timestamp, signature,
  or JSON payload.
