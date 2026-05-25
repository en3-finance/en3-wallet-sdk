# En3 Wallet SDK

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

## What This Repo Is

`en3-wallet-sdk` is a TypeScript SDK skeleton and example set for En3 Wallet-as-a-Service sandbox APIs: wallets, policies, approvals, webhooks, simulations, and transactions.

## Who It Is For

This repo is for partner engineers integrating bank, fintech, payment, remittance, or regulated digital-asset applications with the En3 public sandbox surface.

## What It Demonstrates

- TypeScript client shape for En3 sandbox APIs.
- Create wallet and deposit address flows.
- Submit and simulate policy-aware transactions.
- Approval workflow handling.
- Webhook payload handling.
- Links to `en3-api-spec` for the source contracts.

## Intentionally Out Of Scope

This SDK does not perform production signing, custody, policy enforcement, ledger updates, risk decisions, treasury execution, or customer deployment operations.

## Quickstart

```bash
npm install
npm run build
```

```ts
import { En3Client } from "@en3/wallet-sdk";

const client = new En3Client({
  baseUrl: "https://sandbox.api.en3.example",
  token: process.env.EN3_SANDBOX_TOKEN ?? "sandbox-token"
});

const wallet = await client.createWallet({
  organizationId: "org_sandbox_001",
  ownerType: "user",
  ownerId: "user_001"
});
```

## Example Flows

- `examples/create-wallet.ts`
- `examples/submit-policy-aware-transaction.ts`
- `examples/handle-webhook.ts`

## Related En3 Repositories

- `en3-api-spec`
- `en3-docs`
- `en3-admin-console`
- `en3-reference-bank`
- `en3-web-wallet`
- `en3-mobile-wallet`
- `en3-chain-integrations`
