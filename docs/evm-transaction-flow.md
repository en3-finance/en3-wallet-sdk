# EVM Transaction Flow

This document describes a public, high-level EVM transaction lifecycle for SDK examples.

## Example Lifecycle

1. Client prepares a transaction request.
2. Client sends the request through a documented en3 API boundary.
3. Platform performs private policy, compliance, and custody checks.
4. Transaction is approved, rejected, or returned for additional review.
5. Client receives a status update or event notification.
6. Client displays transaction status to the user.

## Boundary

The public SDK can describe request flow and status handling. It must not publish private signing, MPC, custody, compliance, or policy logic.

