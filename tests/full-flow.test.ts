import { describe, expect, it, vi } from "vitest";
import { En3Client, type FetchLike } from "../src/index.js";

describe("full sandbox flow", () => {
  it("runs the reference bank customer flow against mock responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: "org_001", name: "Reference Bank", status: "sandbox_active", createdAt: "2026-05-26T00:00:00Z" }, 201))
      .mockResolvedValueOnce(jsonResponse({ id: "user_001", organizationId: "org_001", externalUserId: "core-user-001", status: "active", createdAt: "2026-05-26T00:00:01Z" }, 201))
      .mockResolvedValueOnce(jsonResponse(wallet(), 201))
      .mockResolvedValueOnce(jsonResponse(address(), 201))
      .mockResolvedValueOnce(jsonResponse(policy(), 201))
      .mockResolvedValueOnce(jsonResponse(transaction(), 202))
      .mockResolvedValueOnce(jsonResponse(simulation(), 200))
      .mockResolvedValueOnce(jsonResponse(approval(), 200))
      .mockResolvedValueOnce(jsonResponse({ items: [auditEvent()] }, 200))
      .mockResolvedValueOnce(jsonResponse(webhookEndpoint(), 201));

    const client = new En3Client({
      apiKey: "sandbox-token",
      baseUrl: "https://sandbox.api.en3.example",
      environment: "sandbox",
      fetch: fetchMock as FetchLike
    });

    const organization = await client.organizations.create({ name: "Reference Bank" });
    const user = await client.users.create({
      organizationId: organization.id,
      externalUserId: "core-user-001"
    });
    const customerWallet = await client.wallets.create({
      organizationId: organization.id,
      ownerType: "user",
      ownerId: user.id
    });
    const depositAddress = await client.wallets.createAddress(customerWallet.id, {
      network: "base-sepolia",
      asset: "USDC"
    });
    const policyResult = await client.policies.create({
      organizationId: organization.id,
      name: "High value stablecoin transfer approval",
      rules: [{ type: "transaction_amount", asset: "USDC", threshold: "10000.00", action: "require_approval" }]
    });
    const outgoingPayment = await client.transactions.create({
      organizationId: organization.id,
      walletId: customerWallet.id,
      asset: "USDC",
      amount: "12500.00",
      network: "base-sepolia",
      destinationAddress: "0x1111111111111111111111111111111111111111",
      idempotencyKey: "partner-txn-0001"
    });
    const simulated = await client.transactions.simulate(outgoingPayment.id);
    const approved = await client.transactions.approve(outgoingPayment.id, {
      decidedBy: "admin_001",
      decision: "approve"
    });
    const auditEvents = await client.auditEvents.list({ organizationId: organization.id });
    const webhook = await client.webhookEndpoints.create({
      organizationId: organization.id,
      url: "https://example.invalid/en3/webhooks",
      events: ["transaction.settled", "audit.event_recorded"]
    });

    expect(depositAddress.status).toBe("active");
    expect(policyResult.rules[0]?.action).toBe("require_approval");
    expect(simulated.result).toBe("approval_required");
    expect(approved.status).toBe("approved");
    expect(auditEvents.items).toHaveLength(1);
    expect(webhook.events).toContain("transaction.settled");
    expect(fetchMock).toHaveBeenCalledTimes(10);
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function wallet() {
  return {
    id: "wallet_001",
    organizationId: "org_001",
    ownerType: "user",
    ownerId: "user_001",
    status: "active",
    balances: [{ asset: "USDC", network: "base-sepolia", available: "0.00", pending: "0.00" }]
  };
}

function address() {
  return {
    id: "addr_001",
    walletId: "wallet_001",
    network: "base-sepolia",
    asset: "USDC",
    address: "0x2222222222222222222222222222222222222222",
    status: "active"
  };
}

function policy() {
  return {
    id: "policy_001",
    organizationId: "org_001",
    name: "High value stablecoin transfer approval",
    status: "active",
    rules: [{ type: "transaction_amount", asset: "USDC", threshold: "10000.00", action: "require_approval" }]
  };
}

function transaction() {
  return {
    id: "txn_001",
    organizationId: "org_001",
    walletId: "wallet_001",
    type: "withdrawal",
    asset: "USDC",
    amount: "12500.00",
    network: "base-sepolia",
    destinationAddress: "0x1111111111111111111111111111111111111111",
    status: "requires_approval",
    policyResult: "approval_required",
    createdAt: "2026-05-26T00:00:02Z"
  };
}

function simulation() {
  return {
    transactionId: "txn_001",
    result: "approval_required",
    estimatedFee: "0.10",
    policyResult: "approval_required",
    riskSignals: ["amount_threshold"]
  };
}

function approval() {
  return {
    id: "approval_001",
    transactionId: "txn_001",
    status: "approved",
    decidedBy: "admin_001",
    decidedAt: "2026-05-26T00:00:03Z"
  };
}

function auditEvent() {
  return {
    id: "audit_001",
    organizationId: "org_001",
    actorType: "admin",
    actorId: "admin_001",
    action: "transaction.approved",
    resourceType: "transaction",
    resourceId: "txn_001",
    createdAt: "2026-05-26T00:00:04Z"
  };
}

function webhookEndpoint() {
  return {
    id: "wh_001",
    organizationId: "org_001",
    url: "https://example.invalid/en3/webhooks",
    events: ["transaction.settled", "audit.event_recorded"],
    status: "active"
  };
}
