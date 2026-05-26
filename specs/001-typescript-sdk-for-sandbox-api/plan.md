# Implementation Plan: SDK for Sandbox API

**Branch**: `001-typescript-sdk-for-sandbox-api` | **Date**: 2026-05-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-typescript-sdk-for-sandbox-api/spec.md`

## Summary

Evolve the existing `@en3/wallet-sdk` skeleton into a practical TypeScript SDK for
the public En3 sandbox API contract. Preserve the current package, align method
names and payloads with `../en3-api-spec/openapi/en3-wallet-api.yaml`, add typed
errors, grouped resources, sandbox HMAC webhook verification, copy-pasteable
examples, Vitest coverage, README updates, lightweight CI, and a final Codex report.

## Technical Context

**Language/Version**: TypeScript 5.5+, ES2022 modules

**Primary Dependencies**: Runtime uses platform `fetch` and Node `crypto`; dev
dependencies use TypeScript, Vitest, and Node types

**Storage**: N/A

**Testing**: Vitest with mocked `fetch`/HTTP responses

**Target Platform**: Node.js 20+ and modern JavaScript runtimes with `fetch`

**Project Type**: Single SDK package

**Performance Goals**: Minimal SDK overhead; no polling, background workers, or
client-side transaction execution

**Constraints**: Public sandbox/reference only; no custody, private keys, production
signing, live vendor integrations, secrets, private endpoints, or customer data

**Scale/Scope**: Small manually maintained SDK surface for the current public
sandbox contract, not a generated multi-language SDK

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Contract fidelity: PASS. The SDK method list maps to
  `../en3-api-spec/openapi/en3-wallet-api.yaml` operations and
  `../en3-api-spec/asyncapi/en3-webhooks.yaml` event names.
- Public boundary: PASS. The plan excludes custody, private key handling,
  production signing, real signer endpoints, fake vendor integrations, secrets,
  private endpoints, customer data, and internal deployment configuration.
- Typed interface: PASS. `src/errors.ts` will define SDK error classes for HTTP,
  validation/auth/rate-limit/server/network, and webhook verification failures.
- Examples and tests: PASS. Examples and tests are explicit implementation tasks,
  including one full mock sandbox flow.
- Truthful docs: PASS. README/report will state public sandbox/reference scope and
  avoid production-readiness, audited MPC/TSS, customer, partner, regulatory,
  certification, fundraising, or private deployment claims.

## Project Structure

### Documentation (this feature)

```text
specs/001-typescript-sdk-for-sandbox-api/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- sdk-contract.md
|   `-- source-contracts.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- client.ts
|-- errors.ts
|-- index.ts
|-- types.ts
`-- webhooks.ts

examples/
|-- approve-transaction.ts
|-- create-address.ts
|-- create-wallet.ts
|-- full-bank-customer-flow.ts
|-- handle-webhook.ts
`-- submit-policy-aware-transaction.ts

tests/
|-- client.test.ts
|-- errors.test.ts
|-- full-flow.test.ts
`-- webhooks.test.ts

.github/workflows/ci.yml
```

**Structure Decision**: Keep the repository as a single TypeScript SDK package.
Do not introduce generated clients, server code, custody modules, signer modules,
or fake vendor integration modules.

## Phase 0: Research

Research is captured in [research.md](./research.md).

## Phase 1: Design & Contracts

Data entities are captured in [data-model.md](./data-model.md). Public SDK contract
notes are captured in [contracts/sdk-contract.md](./contracts/sdk-contract.md) and
[contracts/source-contracts.md](./contracts/source-contracts.md). Quickstart
validation is captured in [quickstart.md](./quickstart.md).

## Post-Design Constitution Check

- Contract fidelity: PASS. Contracts name the source OpenAPI/AsyncAPI files and
  commit inspected locally.
- Public boundary: PASS. Webhook verification is explicitly sandbox/mock HMAC only.
- Typed interface: PASS. Error taxonomy is part of the design model and contract.
- Examples and tests: PASS. Tasks will include example, typecheck, and Vitest work.
- Truthful docs: PASS. README and CODEX report are final quality-gate tasks.

## Complexity Tracking

No constitution violations or added complexity exceptions.
