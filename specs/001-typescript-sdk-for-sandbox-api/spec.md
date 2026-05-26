# Feature Specification: SDK for Sandbox API

**Feature Branch**: `001-typescript-sdk-for-sandbox-api`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Build a practical SDK for the public En3 sandbox API contract with grouped resources, typed errors, webhook verification in mock/HMAC sandbox mode, examples, tests, README, CI, and a final report. The SDK must follow `en3-api-spec`, avoid custody/private-key/production-signing behavior, and avoid public overclaims."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set up wallet sandbox resources (Priority: P1)

A partner engineer can configure the SDK with a sandbox API key and base URL, create
an organization, create a user, create a wallet for that user, retrieve the wallet,
and create a deposit address using the documented sandbox contract.

**Why this priority**: This is the minimum useful onboarding path for banks,
fintechs, payment providers, remittance companies, and regulated digital-asset
product teams evaluating the public sandbox integration surface.

**Independent Test**: Mock HTTP responses for organization, user, wallet, wallet
retrieval, and address creation; verify each call uses the documented method, path,
authorization header, and JSON body.

**Acceptance Scenarios**:

1. **Given** a configured sandbox client, **When** an engineer creates an organization, user, wallet, and address, **Then** each returned object is typed and matches the public sandbox contract.
2. **Given** an existing wallet identifier, **When** an engineer retrieves the wallet, **Then** the SDK calls the wallet detail endpoint and returns wallet balances and status.

---

### User Story 2 - Submit and approve policy-aware transactions (Priority: P1)

A partner engineer can submit a sandbox transaction, simulate its policy outcome,
and approve or reject a transaction that requires approval without the SDK handling
private keys, custody, or production signing.

**Why this priority**: Policy-aware transaction flow is core to demonstrating wallet
orchestration and control-plane behavior while keeping real execution private.

**Independent Test**: Mock transaction, simulation, and approval responses; verify
the SDK constructs the documented requests and exposes typed transaction,
simulation, and approval results.

**Acceptance Scenarios**:

1. **Given** a wallet and destination address, **When** an engineer submits a sandbox transaction, **Then** the SDK sends the documented transaction request and returns the accepted transaction.
2. **Given** a submitted transaction, **When** an engineer simulates and approves it, **Then** the SDK returns the simulation and approval records without performing signing or custody operations.

---

### User Story 3 - Configure control-plane references (Priority: P2)

A partner engineer can create a sandbox policy, register a webhook endpoint, and list
audit events to understand the public control-plane integration boundary.

**Why this priority**: Policies, webhooks, and audit events show how a wallet control
plane can be integrated without exposing private enforcement or production
infrastructure.

**Independent Test**: Mock policy creation, webhook endpoint creation, and audit
listing responses; verify request construction and typed return values.

**Acceptance Scenarios**:

1. **Given** a sandbox organization, **When** an engineer creates a policy, **Then** the SDK sends the policy request and returns a typed sandbox policy.
2. **Given** a webhook destination URL and selected events, **When** an engineer registers the endpoint, **Then** the SDK returns a typed webhook endpoint.
3. **Given** an organization identifier, **When** an engineer lists audit events, **Then** the SDK returns typed audit items.

---

### User Story 4 - Verify sandbox webhooks (Priority: P2)

A partner backend can verify a sandbox webhook payload using the documented HMAC
header model and receive typed verification failures for invalid signatures,
timestamps, or malformed headers.

**Why this priority**: Webhook handling is a common integration point and must be
explicitly labeled as sandbox/mock verification rather than production
secret-management.

**Independent Test**: Use a fixed mock secret, raw JSON payload, timestamp, and
signature header to verify success and failure cases.

**Acceptance Scenarios**:

1. **Given** a valid sandbox signature over a raw payload, **When** verification runs, **Then** the SDK returns the parsed event.
2. **Given** an invalid signature or expired timestamp, **When** verification runs, **Then** the SDK throws a typed webhook verification error.

---

### User Story 5 - Follow copy-pasteable examples (Priority: P3)

A partner engineer can read the README and examples to understand the public
sandbox boundary and copy the examples into a sandbox integration after replacing
placeholder credentials and URLs.

**Why this priority**: Examples and truthful docs reduce integration uncertainty
and prevent overclaims about private production capabilities.

**Independent Test**: Typecheck all examples and verify they do not contain secrets,
real endpoints, customer data, production signing, or private key behavior.

**Acceptance Scenarios**:

1. **Given** a fresh checkout, **When** an engineer reads the quickstart and examples, **Then** they can identify how to configure the client and call each core sandbox operation.
2. **Given** the public README, **When** it is reviewed for claims, **Then** it clearly states sandbox/reference scope and excludes custody, private key, production signing, and compliance-certification claims.

### Edge Cases

- API returns non-JSON or empty error bodies.
- API returns validation, authentication, authorization, rate-limit, server, or network failures.
- `baseUrl` includes or omits a trailing slash.
- Optional query parameters are omitted.
- Webhook signature headers are missing, malformed, expired, or generated from a different payload.
- Example code runs without real credentials by using obvious sandbox placeholders only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The SDK MUST expose a client constructor accepting `apiKey`, `baseUrl`, and `environment` with supported environments `sandbox` and `local`.
- **FR-002**: The SDK MUST expose grouped resource clients for organizations, users, wallets, transactions, policies, audit events, webhook endpoints, and webhooks.
- **FR-003**: The SDK MUST support `organizations.create`, `users.create`, `wallets.create`, `wallets.get`, `wallets.createAddress`, `transactions.create`, `transactions.simulate`, `transactions.approve`, `policies.create`, `auditEvents.list`, `webhookEndpoints.create`, and `webhooks.verifySignature`.
- **FR-004**: Core API operations MUST use methods, paths, request bodies, query parameters, and response shapes traceable to `en3-api-spec` public sandbox contracts.
- **FR-005**: The SDK MUST send bearer authentication using the configured sandbox API key and JSON content headers for requests with bodies.
- **FR-006**: The SDK MUST expose typed errors for HTTP failures, validation failures, authentication failures, authorization failures, rate limits, server failures, network failures, and webhook verification failures.
- **FR-007**: Webhook verification MUST be limited to sandbox/mock HMAC verification with caller-provided test secrets and MUST fail closed for invalid or stale signatures.
- **FR-008**: Examples MUST include create wallet, create address, submit policy-aware transaction, approve transaction, handle webhook, and full bank customer flow scenarios.
- **FR-009**: Tests MUST cover request construction, typed errors, webhook signature verification, and one full sandbox flow with mock responses.
- **FR-010**: README and examples MUST clearly state no production signing, no custody, and no private keys.
- **FR-011**: Documentation MUST link to `en3-api-spec` and `en3-reference-bank`.
- **FR-012**: Existing useful SDK files and public examples MUST be preserved or evolved rather than replaced with unrelated scaffolding.

### Public Boundary Requirements *(include for public En3 artifacts)*

- **PBR-001**: Public artifacts MUST describe this SDK as a sandbox/reference SDK unless production behavior is proven in the repository.
- **PBR-002**: Public artifacts MUST NOT claim audited MPC/TSS, production readiness, live customers, pilots, bank partnerships, regulatory approval, vendor integrations, compliance certifications, fundraising details, or private partner context.
- **PBR-003**: Public artifacts MUST NOT include secrets, private endpoints, customer data, real RPC URLs, private keys, seed material, or internal deployment configuration.
- **PBR-004**: Compliance-related language MUST remain interface-level and MUST NOT fake live KYT, sanctions, address-risk, or vendor integrations.

### Key Entities *(include if feature involves data)*

- **Client Configuration**: Sandbox API key, base URL, and selected environment.
- **Organization**: Sandbox tenant or partner organization record.
- **User**: Sandbox end-user record owned by an organization.
- **Wallet**: Sandbox wallet record with owner, status, and balances.
- **Address**: Sandbox deposit address for a wallet, network, and asset.
- **Transaction**: Sandbox transaction request and lifecycle status.
- **Transaction Simulation**: Mock policy/risk result and estimated fee for a transaction.
- **Approval**: Sandbox approval decision for a transaction.
- **Policy**: Sandbox policy definition with rules and status.
- **Audit Event**: Control-plane audit record for sandbox activity.
- **Webhook Endpoint**: Registered sandbox destination and subscribed event names.
- **Webhook Event**: Raw signed sandbox event payload and parsed event object.
- **SDK Error**: Typed failure object for transport, HTTP, validation, rate-limit, and webhook errors.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A partner engineer can follow the README quickstart and understand how to create an organization, user, wallet, and address in under 10 minutes using placeholder sandbox credentials.
- **SC-002**: All requested SDK methods are exported from the package entrypoint and have typed request and response shapes.
- **SC-003**: Automated tests cover all core API operation groups, typed errors, webhook verification, and one full mock sandbox flow.
- **SC-004**: Invalid webhook signatures, stale timestamps, and missing signature headers produce typed verification failures.
- **SC-005**: README and examples contain no production-readiness, custody, private-key, audited MPC/TSS, customer, partner, regulatory, certification, or fake vendor-integration claims.
- **SC-006**: A pre-commit secret scan for obvious token and private-key patterns completes with no findings.

## Assumptions

- `../en3-api-spec` is available locally and contains the current public sandbox OpenAPI and AsyncAPI contracts.
- Network calls are mocked in tests; no live En3 service or real credentials are required.
- Placeholder sandbox URLs and tokens are acceptable in examples when clearly labeled.
- Public compliance-readiness concepts are represented only as interfaces and examples, not live vendor integrations.
- The package remains a small SDK package rather than a generated monorepo or multi-language SDK.
