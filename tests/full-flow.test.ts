import { describe, expect, it, vi } from "vitest";
import { En3Client, type FetchLike } from "../src/index.js";

describe("full sandbox flow", () => {
  it("runs the SandBank demo flow against mock responses", async () => {
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

    const organization = await client.organizations.create({ name: "SandBank" });
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
      organizationId: organization.id,
      networkCode: "sandbox-base-sepolia",
      assetCode: "USDC"
    });
    const policyRecord = await client.policies.create({
      organizationId: organization.id,
      name: "High value stablecoin transfer approval",
      approvalThreshold: "10000.00",
      blockThreshold: "50000.00"
    });
    const outgoingPayment = await client.transactions.create({
      organizationId: organization.id,
      walletId: customerWallet.id,
      type: "withdrawal",
      assetCode: "USDC",
      amount: "12500.00",
      networkCode: "sandbox-base-sepolia",
      destinationAddress: "sandbox_destination_sandbank_000001",
      idempotencyKey: "sandbank-txn-000001"
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
      events: ["transaction.settled", "audit.event_created", "reconciliation.updated"]
    });

    expect(depositAddress.status).toBe("active");
    expect(policyRecord.approvalThreshold).toBe("10000.00");
    expect(simulated.policyDecision.outcome).toBe("approval_required");
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
    createdAt: "2026-05-26T00:00:02Z"
  };
}

function address() {
  return {
    id: "addr_001",
    walletId: "wallet_001",
    organizationId: "org_001",
    networkCode: "sandbox-base-sepolia",
    assetCode: "USDC",
    address: "sandbox_addr_sandbank_000001",
    status: "active",
    createdAt: "2026-05-26T00:00:03Z"
  };
}

function policy() {
  return {
    id: "policy_001",
    organizationId: "org_001",
    name: "High value stablecoin transfer approval",
    status: "active",
    approvalThreshold: "10000.00",
    blockThreshold: "50000.00",
    createdAt: "2026-05-26T00:00:04Z"
  };
}

function transaction() {
  return {
    id: "txn_001",
    organizationId: "org_001",
    walletId: "wallet_001",
    type: "withdrawal",
    assetCode: "USDC",
    amount: "12500.00",
    networkCode: "sandbox-base-sepolia",
    destinationAddress: "sandbox_destination_sandbank_000001",
    status: "requires_approval",
    createdAt: "2026-05-26T00:00:02Z"
  };
}

function simulation() {
  return {
    id: "sim_001",
    transactionId: "txn_001",
    estimatedFee: "0.10",
    policyDecision: {
      id: "pdc_001",
      policyId: "policy_001",
      transactionId: "txn_001",
      outcome: "approval_required"
    },
    riskReview: {
      id: "rrv_001",
      transactionId: "txn_001",
      decision: "allow",
      signals: ["sandbox_amount_threshold"],
      vendorIntegration: false
    },
    transactionStatus: "requires_approval"
  };
}

function approval() {
  return {
    id: "approval_001",
    organizationId: "org_001",
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
    events: ["transaction.settled", "audit.event_created", "reconciliation.updated"],
    status: "active",
    createdAt: "2026-05-26T00:00:06Z"
  };
}
