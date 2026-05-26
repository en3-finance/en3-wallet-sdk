# Quickstart: SDK for Sandbox API

## Install and Validate

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## Minimal Sandbox Flow

```ts
import { En3Client } from "@en3/wallet-sdk";

const client = new En3Client({
  apiKey: process.env.EN3_SANDBOX_API_KEY ?? "sandbox-token",
  baseUrl: process.env.EN3_SANDBOX_BASE_URL ?? "https://sandbox.api.en3.example",
  environment: "sandbox"
});

const organization = await client.organizations.create({
  name: "Reference Bank"
});

const user = await client.users.create({
  organizationId: organization.id,
  externalUserId: "core-user-001"
});

const wallet = await client.wallets.create({
  organizationId: organization.id,
  ownerType: "user",
  ownerId: user.id
});

const address = await client.wallets.createAddress(wallet.id, {
  network: "base-sepolia",
  asset: "USDC"
});

console.log({ organization, user, wallet, address });
```

## Scope Boundary

This is a public sandbox/reference SDK. It does not perform production signing,
custody, private key management, policy enforcement, treasury execution, ledger
updates, compliance-vendor calls, or customer deployment operations.
