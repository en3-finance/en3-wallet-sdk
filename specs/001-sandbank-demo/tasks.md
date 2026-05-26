# Tasks: SandBank Demo SDK

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

- [X] Inspect `.specify` and existing `specs`.
- [X] Create local `specs/001-sandbank-demo` feature files.
- [X] Inspect `../en3-api-spec` OpenAPI, AsyncAPI, SandBank docs, and public/private boundary.
- [X] Align SDK types with the public REST schemas.
- [X] Keep SDK methods limited to documented endpoints and omit unsupported reconciliation report retrieval.
- [X] Add `webhooks.parseEvent()` and maintain sandbox/mock HMAC verification.
- [X] Add required SandBank examples.
- [X] Update tests for OpenAPI field names and canonical webhook events.
- [X] Run test, build, typecheck, event scan, and secret scan.
- [X] Update `CODEX_REPORT.md`.
- [X] Commit and push focused changes.
