# en3-wallet-sdk

Public SDK boundary and integration examples for en3 enterprise wallet infrastructure.

Status: Early public preview

## Overview

This repository defines the public SDK and integration surface for financial institutions, fintech companies, payment companies, and external teams evaluating en3 wallet infrastructure.

## API Boundary Overview

The SDK examples should show how external systems could integrate with en3 wallet interfaces through documented API boundaries. They must not expose proprietary backend, MPC, compliance, signing, or policy internals.

## What This Repository Contains

- TypeScript-first integration examples.
- Authentication placeholders only.
- Transaction lifecycle examples.
- EVM transaction flow documentation.
- Webhook and event placeholder documentation.
- Integration checklist for fintechs and banks.

## What This Repository Does Not Contain

- Proprietary backend code.
- MPC internals.
- Signing internals.
- Compliance engine.
- Customer-specific implementation details.
- Production endpoints.
- Credentials.

## Enterprise Wallet Infrastructure Context

The SDK boundary is one public integration surface in the en3 enterprise wallet infrastructure stack. It is designed to help financial institutions understand how client systems may connect to the platform without publishing private platform logic.

## Public Demo And Integration Boundary

Examples should use placeholder API hosts, placeholder authentication, and non-production transaction flows until private access is provided through an approved process.

## Security And Custody Boundary

Do not add private keys, seed phrases, access tokens, customer data, production API hosts, regulated compliance material, or private platform implementation details.

## Roadmap

- Add TypeScript package scaffold.
- Add example API client interfaces.
- Add transaction lifecycle examples.
- Add webhook/event placeholder examples.
- Add integration checklist examples for financial institutions.

## Contact

Website: https://en3.finance

