# Examples

These examples are public sandbox/reference flows. They use placeholder URLs,
tokens, identifiers, and mock-friendly payloads only.

- `create-wallet.ts`: create an organization, user, and wallet.
- `create-address.ts`: create a deposit address for a wallet.
- `submit-policy-aware-transaction.ts`: submit and simulate a sandbox transaction.
- `approve-transaction.ts`: approve a sandbox transaction that requires approval.
- `handle-webhook.ts`: verify and route sandbox HMAC webhook events.
- `full-bank-customer-flow.ts`: run the reference bank customer flow end to end.
- `sandbank-create-wallet.ts`: create a SandBank organization, user, wallet, and address.
- `sandbank-payment-with-approval.ts`: submit, simulate, and approve a SandBank payment.
- `sandbank-handle-webhook.ts`: parse, verify, and route SandBank webhook events.
- `sandbank-full-flow.ts`: run the SandBank demo flow end to end.

The examples do not perform production signing, custody, private key management,
ledger updates, treasury execution, compliance-vendor calls, or customer deployment
operations.
