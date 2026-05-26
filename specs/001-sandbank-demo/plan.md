# Implementation Plan: SandBank Demo SDK

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

## Source Contracts

- REST: `../en3-api-spec/openapi/en3-wallet-api.yaml`
- Webhooks: `../en3-api-spec/asyncapi/en3-webhooks.yaml`
- Boundary: `../en3-api-spec/docs/public-private-boundary.md`

## Work

- Align SDK TypeScript models with the public OpenAPI schemas.
- Keep SDK methods limited to documented public paths.
- Add `webhooks.parseEvent()` and retain sandbox/mock HMAC verification only because the public docs define sandbox webhook headers and verification behavior.
- Add required SandBank examples:
  - `examples/sandbank-create-wallet.ts`
  - `examples/sandbank-payment-with-approval.ts`
  - `examples/sandbank-handle-webhook.ts`
  - `examples/sandbank-full-flow.ts`
- Update tests, README, and final report.

## Validation

- `pnpm test`
- `pnpm build`
- `pnpm typecheck`
- example compilation through `tsconfig.json`
- forbidden public event scan
- lightweight secret scan
