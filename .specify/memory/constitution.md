<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME -> I. Public Sandbox Contract Fidelity
- PRINCIPLE_2_NAME -> II. No Client-Side Custody or Production Signing
- PRINCIPLE_3_NAME -> III. Typed Errors and Stable Developer Interface
- PRINCIPLE_4_NAME -> IV. Copy-Pasteable Examples and Test Coverage
- PRINCIPLE_5_NAME -> V. Truthful Public Documentation
Added sections:
- Security and Public Boundary
- Development Workflow and Quality Gates
Removed sections:
- Placeholder Section 2
- Placeholder Section 3
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# En3 Wallet SDK Constitution

## Core Principles

### I. Public Sandbox Contract Fidelity
The SDK MUST follow the public `en3-api-spec` sandbox REST and webhook contracts.
Endpoints, request shapes, response shapes, example payloads, and event names MUST be
traceable to that contract or explicitly marked as SDK-only helper behavior.
Changes that intentionally diverge from `en3-api-spec` MUST update the feature plan
with the reason and the contract follow-up required.

Rationale: This public repository exists to help partner engineers integrate with the
documented sandbox surface, not to invent a parallel API.

### II. No Client-Side Custody or Production Signing
The SDK MUST NOT contain private key management, custody flows, MPC/TSS claims,
production signing orchestration, real signer endpoints, seed phrase handling, or
customer deployment configuration. Any signing-related helper MUST be limited to
mock/sandbox reference behavior and MUST be labeled as such in code and docs.

Rationale: Production cryptography, policy enforcement, risk logic, ledger
infrastructure, treasury execution, and customer deployments are private by design.

### III. Typed Errors and Stable Developer Interface
The SDK MUST expose typed error classes or discriminated error shapes for HTTP
failures, validation failures, authentication failures, rate limits, and webhook
verification failures. Public methods MUST keep stable, predictable names aligned
with the sandbox contract and MUST avoid leaking raw transport details as the only
error interface.

Rationale: Partner engineers need predictable failure handling when wiring sandbox
flows into bank, fintech, payment, remittance, and regulated digital-asset products.

### IV. Copy-Pasteable Examples and Test Coverage
Examples MUST be complete enough to copy into a sandbox integration with only
placeholder credentials and URLs changed. Tests MUST cover core API operations,
request construction, typed errors, webhook signature verification, and at least one
full sandbox flow using mock responses.

Rationale: The repository is a public integration artifact; examples and tests are
the executable proof that the SDK contract is understandable.

### V. Truthful Public Documentation
README, examples, comments, reports, and generated artifacts MUST describe this SDK
as a public sandbox/reference package unless production capabilities are proven in
the repository. They MUST NOT claim audited MPC/TSS, production readiness, live
customers, pilots, bank partnerships, regulatory approval, vendor integrations,
compliance certifications, fundraising details, or private partner context.

Rationale: Public materials must be accurate and must not expose private or
deck-sensitive information.

## Security and Public Boundary

This repository MUST NOT include secrets, personal access tokens, API keys, private
endpoints, real RPC URLs, customer data, internal deployment configuration, private
keys, or seed material. Public compliance-related interfaces may reference sanctions,
KYT, or address-risk concepts only as sandbox/reference boundaries and MUST NOT fake
live vendor integrations.

Webhook signature verification in this repository MUST be limited to sandbox/mock HMAC
verification using caller-provided test secrets. It MUST NOT imply production
secret-management, key-management, delivery guarantees, or compliance operations.

## Development Workflow and Quality Gates

Every feature MUST inspect the existing repository before changes and preserve useful
files. Implementation plans MUST prefer small, working, testable increments over broad
unfinished scaffolding. Tests and type checks MUST run when toolchain installation is
available, and any skipped validation MUST be reported.

For SDK changes, the quality gate is:
- API methods map to `en3-api-spec` or are labeled SDK helpers.
- No custody, private key, production signing, or fake vendor integration code exists.
- Core API operations and webhook verification have tests.
- README and examples clearly state public sandbox/reference boundaries.
- A secret scan for obvious token/key patterns runs before commit.

## Governance

This constitution supersedes conflicting Spec Kit artifacts, task plans, and ad hoc
implementation preferences for this repository. Amendments require an update to this
file, a Sync Impact Report describing affected templates/artifacts, and a semantic
version bump:
- MAJOR for removing or redefining a core principle.
- MINOR for adding a principle or materially expanding governance.
- PATCH for clarifications that do not change obligations.

Compliance is reviewed during `/speckit-plan`, `/speckit-tasks`,
`/speckit-analyze`, and `/speckit-implement`. If a feature cannot satisfy a MUST
statement, the plan MUST stop and document the blocking conflict rather than weaken
the principle inside the feature.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
