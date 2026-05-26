# Research: SDK for Sandbox API

## Decision: Preserve and evolve the existing SDK package

**Rationale**: The repository already contains `package.json`, `tsconfig.json`,
`src/client.ts`, `src/types.ts`, examples, README, and SECURITY.md. Evolving these
files satisfies the instruction to preserve useful files and keeps the change small.

**Alternatives considered**: Replacing the package with generated scaffolding was
rejected because the public contract is small and a generator would add maintenance
weight without improving the sandbox MVP.

## Decision: Use `../en3-api-spec` as the source contract

**Rationale**: The local `../en3-api-spec` repo exists and was fetched. Its current
contract commit is `6d8da64` with `openapi/en3-wallet-api.yaml`,
`asyncapi/en3-webhooks.yaml`, and sandbox examples. SDK method names will map to
the documented operations.

**Alternatives considered**: Hardcoding an invented schema was rejected because the
feature explicitly requires contract fidelity when the API spec exists.

## Decision: Manual typed SDK rather than OpenAPI code generation

**Rationale**: The public surface is intentionally small: organization, user,
wallet, address, transaction, simulation, approval, policy, audit, and webhook
endpoint operations. Manual types make public boundary labels and typed errors
clearer for this MVP.

**Alternatives considered**: OpenAPI generation was rejected for now because it
would introduce generator config, generated-file churn, and less readable examples.

## Decision: Use platform `fetch` with optional injection for tests

**Rationale**: Node 20+ and modern runtimes provide `fetch`; injecting a fetch
function keeps tests lightweight and avoids a runtime dependency.

**Alternatives considered**: Adding an HTTP client dependency was rejected because
the SDK currently needs only basic JSON requests and typed error handling.

## Decision: Use Vitest for SDK tests

**Rationale**: Vitest is lightweight, TypeScript-friendly, and compatible with the
existing package structure. It can mock fetch and run quickly in CI.

**Alternatives considered**: Node's built-in test runner was considered, but Vitest
offers simpler mocking and assertions for this SDK.

## Decision: Sandbox webhook HMAC helper signs `timestamp.rawBody`

**Rationale**: `../en3-api-spec/docs/webhook-signatures.md` defines the sandbox
header shape but does not specify a canonical HMAC string. The SDK will clearly
label its helper as mock/sandbox behavior and use `En3-Event-Timestamp + "." +
rawBody` with SHA-256 HMAC, accepting signatures as `sha256=<hex>` or raw hex.

**Alternatives considered**: Implementing production-grade delivery verification
or key management was rejected by the constitution and user constraints.

## Decision: Use pnpm-compatible scripts and lightweight GitHub Actions

**Rationale**: The user requested a TypeScript/pnpm SDK skeleton if needed. The
existing package can be made pnpm-friendly with `packageManager`, lockfile
generation, `typecheck`, `test`, and `build` scripts. CI can run install,
typecheck, and test.

**Alternatives considered**: Heavy release, publish, lint, or coverage pipelines
were rejected to keep public CI likely to pass.
