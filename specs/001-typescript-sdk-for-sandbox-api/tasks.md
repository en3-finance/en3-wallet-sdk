# Tasks: SDK for Sandbox API

**Input**: Design documents from `/specs/001-typescript-sdk-for-sandbox-api/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are required by the feature specification and constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Update package metadata, pnpm packageManager, scripts, exports, and dev dependencies in package.json
- [X] T002 [P] Configure TypeScript and Vitest test discovery in tsconfig.json and vitest.config.ts
- [X] T003 [P] Create or verify Node package ignore rules in .gitignore and .npmignore
- [X] T004 [P] Add lightweight install/typecheck/test CI in .github/workflows/ci.yml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core SDK infrastructure that MUST be complete before user stories

- [X] T005 Define public contract-aligned SDK types in src/types.ts
- [X] T006 [P] Implement typed SDK errors in src/errors.ts
- [X] T007 Implement normalized HTTP request handling and resource grouping foundation in src/client.ts
- [X] T008 [P] Implement sandbox webhook HMAC helper foundation in src/webhooks.ts
- [X] T009 Export public SDK modules from src/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Set up wallet sandbox resources (Priority: P1) MVP

**Goal**: Configure the SDK and create/retrieve organization, user, wallet, and address resources.

**Independent Test**: Mock HTTP responses and verify method, path, headers, body, and typed results.

### Tests for User Story 1

- [X] T010 [P] [US1] Add organization, user, wallet, wallet retrieval, and address request construction tests in tests/client.test.ts

### Implementation for User Story 1

- [X] T011 [US1] Implement organizations, users, wallets.create, wallets.get, and wallets.createAddress resources in src/client.ts
- [X] T012 [P] [US1] Update create wallet and create address examples in examples/create-wallet.ts and examples/create-address.ts

**Checkpoint**: User Story 1 is independently testable with mocked HTTP.

---

## Phase 4: User Story 2 - Submit and approve policy-aware transactions (Priority: P1)

**Goal**: Submit, simulate, and approve sandbox transactions without signing or custody behavior.

**Independent Test**: Mock transaction, simulation, and approval responses and verify typed results.

### Tests for User Story 2

- [X] T013 [P] [US2] Add transaction create, simulate, approve, and typed HTTP error tests in tests/client.test.ts

### Implementation for User Story 2

- [X] T014 [US2] Implement transactions.create, transactions.simulate, transactions.approve, and compatibility aliases in src/client.ts
- [X] T015 [P] [US2] Update submit and approval examples in examples/submit-policy-aware-transaction.ts and examples/approve-transaction.ts

**Checkpoint**: User Story 2 is independently testable with mocked HTTP.

---

## Phase 5: User Story 3 - Configure control-plane references (Priority: P2)

**Goal**: Create policies, create webhook endpoints, and list audit events through typed SDK resources.

**Independent Test**: Mock policy, webhook endpoint, and audit responses and verify request construction.

### Tests for User Story 3

- [X] T016 [P] [US3] Add policy, audit event, and webhook endpoint tests in tests/client.test.ts

### Implementation for User Story 3

- [X] T017 [US3] Implement policies, auditEvents, and webhookEndpoints resources in src/client.ts

**Checkpoint**: User Story 3 is independently testable with mocked HTTP.

---

## Phase 6: User Story 4 - Verify sandbox webhooks (Priority: P2)

**Goal**: Verify sandbox/mock HMAC webhook signatures and expose typed verification failures.

**Independent Test**: Use fixed payloads, headers, and secrets for success and failure cases.

### Tests for User Story 4

- [X] T018 [P] [US4] Add webhook signature success and failure tests in tests/webhooks.test.ts

### Implementation for User Story 4

- [X] T019 [US4] Implement verifySandboxWebhookSignature and client.webhooks.verifySignature in src/webhooks.ts and src/client.ts
- [X] T020 [P] [US4] Update webhook handling example in examples/handle-webhook.ts

**Checkpoint**: User Story 4 is independently testable with fixed HMAC fixtures.

---

## Phase 7: User Story 5 - Follow copy-pasteable examples (Priority: P3)

**Goal**: Provide truthful README/examples and a full mock bank customer flow.

**Independent Test**: Typecheck examples and run the full mock sandbox flow test.

### Tests for User Story 5

- [X] T021 [P] [US5] Add full sandbox flow test in tests/full-flow.test.ts

### Implementation for User Story 5

- [X] T022 [US5] Add full bank customer flow example in examples/full-bank-customer-flow.ts
- [X] T023 [P] [US5] Rewrite README quickstart, method list, examples, links, and public boundary statements in README.md
- [X] T024 [P] [US5] Preserve and verify public security boundary language in SECURITY.md

**Checkpoint**: User Story 5 is independently demonstrable from docs and examples.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T025 [P] Update examples README index in examples/README.md
- [X] T026 Run pnpm install to generate pnpm-lock.yaml
- [X] T027 Run typecheck, tests, and build using package scripts
- [X] T028 Run obvious secret scan for public-token/private-key patterns across the repository
- [X] T029 Write final implementation report in CODEX_REPORT.md
- [X] T030 Review git diff and create final feature commit on branch 001-typescript-sdk-for-sandbox-api

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 8)**: Depends on all selected user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational
- **User Story 2 (P1)**: Starts after Foundational and may use fixture wallet ids
- **User Story 3 (P2)**: Starts after Foundational
- **User Story 4 (P2)**: Starts after Foundational
- **User Story 5 (P3)**: Starts after User Stories 1-4 provide runnable SDK behavior

### Within Each User Story

- Tests are written before implementation tasks.
- Core implementation is completed before examples/docs for that story.
- A story is complete only when its tests pass with mocked responses.

### Parallel Opportunities

- T002, T003, and T004 can run after T001 scope is known because they touch separate files.
- T006 and T008 can run after T005 because they touch separate modules.
- T010, T013, T016, T018, and T021 are test tasks touching separate test files or sections and can be batched carefully.
- Example and documentation tasks marked [P] touch separate files.

---

## Parallel Example: User Story 4

```bash
Task: "Add webhook signature success and failure tests in tests/webhooks.test.ts"
Task: "Update webhook handling example in examples/handle-webhook.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 and 2)

1. Complete Phase 1 and Phase 2.
2. Complete User Story 1 for organization/user/wallet/address setup.
3. Complete User Story 2 for transaction simulation and approval.
4. Validate mocked request construction and typed errors.

### Incremental Delivery

1. Add setup resources.
2. Add transaction resources.
3. Add control-plane resources.
4. Add webhook verification.
5. Add full docs/examples and final validation.

### Notes

- Avoid generated clients unless the source contract expands substantially.
- Keep all public examples sandbox/reference only.
- Do not add custody, private key, production signing, live KYT/sanctions, or fake
  vendor integration modules.
