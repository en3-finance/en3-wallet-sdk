# Source Contracts

The SDK implementation is based on the local public API spec repository:

- Repository path: `../en3-api-spec`
- Commit inspected: `6d8da64`
- OpenAPI: `../en3-api-spec/openapi/en3-wallet-api.yaml`
- AsyncAPI: `../en3-api-spec/asyncapi/en3-webhooks.yaml`
- Webhook signature boundary: `../en3-api-spec/docs/webhook-signatures.md`
- Example payloads: `../en3-api-spec/examples/`

## OpenAPI Operations Used

| SDK method | Source operation | Method/path |
|------------|------------------|-------------|
| `organizations.create` | `createOrganization` | `POST /organizations` |
| `users.create` | `createUser` | `POST /users` |
| `wallets.create` | `createWallet` | `POST /wallets` |
| `wallets.get` | `getWallet` | `GET /wallets/{walletId}` |
| `wallets.createAddress` | `createWalletAddress` | `POST /wallets/{walletId}/addresses` |
| `transactions.create` | `submitTransaction` | `POST /transactions` |
| `transactions.simulate` | `simulateTransaction` | `POST /transactions/{transactionId}/simulate` |
| `transactions.approve` | `approveTransaction` | `POST /transactions/{transactionId}/approve` |
| `auditEvents.list` | `listAuditEvents` | `GET /audit-events` |
| `policies.create` | `createPolicy` | `POST /policies` |
| `webhookEndpoints.create` | `createWebhookEndpoint` | `POST /webhook-endpoints` |

## AsyncAPI Events Used

The SDK exports string types for the public sandbox event names in
`../en3-api-spec/asyncapi/en3-webhooks.yaml`, including wallet, address,
transaction, risk review, reconciliation, and audit event names.

## SDK-Only Helper

`webhooks.verifySignature` is an SDK helper. It is not a production delivery,
secret-management, or key-management implementation. It performs sandbox/mock HMAC
verification for local tests and reference integrations.
