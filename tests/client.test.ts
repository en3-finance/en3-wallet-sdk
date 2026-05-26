import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  En3AuthenticationError,
  En3Client,
  En3NetworkError,
  En3ValidationError,
  type FetchLike
} from "../src/index.js";

const baseUrl = "https://sandbox.api.en3.example";

describe("En3Client request construction", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
  });

  it("creates organizations, users, wallets, gets wallets, and creates addresses", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ id: "org_001", name: "Reference Bank", status: "sandbox_active", createdAt: "2026-05-26T00:00:00Z" }, 201))
      .mockResolvedValueOnce(jsonResponse({ id: "user_001", organizationId: "org_001", externalUserId: "core-user-001", status: "active", createdAt: "2026-05-26T00:00:01Z" }, 201))
      .mockResolvedValueOnce(jsonResponse(wallet(), 201))
      .mockResolvedValueOnce(jsonResponse(wallet(), 200))
      .mockResolvedValueOnce(jsonResponse(address(), 201));

    const client = testClient(fetchMock);

    const organization = await client.organizations.create({ name: "Reference Bank" });
    const user = await client.users.create({
      organizationId: organization.id,
      externalUserId: "core-user-001"
    });
    const createdWallet = await client.wallets.create({
      organizationId: organization.id,
      ownerType: "user",
      ownerId: user.id
    });
    const fetchedWallet = await client.wallets.get(createdWallet.id);
    const createdAddress = await client.wallets.createAddress(createdWallet.id, {
      network: "base-sepolia",
      asset: "USDC"
    });

    expect(createdAddress.address).toBe("0x2222222222222222222222222222222222222222");
    expect(fetchedWallet.balances[0]?.asset).toBe("USDC");
    expect(fetchMock).toHaveBeenCalledTimes(5);
    expectCall(fetchMock, 0, "POST", "/organizations", { name: "Reference Bank" });
    expectCall(fetchMock, 1, "POST", "/users", {
      organizationId: "org_001",
      externalUserId: "core-user-001"
    });
    expectCall(fetchMock, 2, "POST", "/wallets", {
      organizationId: "org_001",
      ownerType: "user",
      ownerId: "user_001"
    });
    expectCall(fetchMock, 3, "GET", "/wallets/wallet_001");
    expectCall(fetchMock, 4, "POST", "/wallets/wallet_001/addresses", {
      network: "base-sepolia",
      asset: "USDC"
    });
  });

  it("creates, simulates, and approves transactions with typed errors", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(transaction(), 202))
      .mockResolvedValueOnce(jsonResponse(simulation(), 200))
      .mockResolvedValueOnce(jsonResponse(approval(), 200))
      .mockResolvedValueOnce(
        jsonResponse({ code: "validation_error", message: "amount is required", requestId: "req_001" }, 422)
      )
      .mockResolvedValueOnce(jsonResponse({ code: "unauthorized", message: "invalid token" }, 401));

    const client = testClient(fetchMock);

    await expect(
      client.transactions.create({
        organizationId: "org_001",
        walletId: "wallet_001",
        asset: "USDC",
        amount: "12500.00",
        network: "base-sepolia",
        destinationAddress: "0x1111111111111111111111111111111111111111",
        idempotencyKey: "partner-txn-0001"
      })
    ).resolves.toMatchObject({ id: "txn_001", status: "requires_approval" });

    await expect(client.transactions.simulate("txn_001")).resolves.toMatchObject({
      result: "approval_required"
    });
    await expect(
      client.transactions.approve("txn_001", {
        decidedBy: "admin_001",
        decision: "approve"
      })
    ).resolves.toMatchObject({ status: "approved" });

    await expect(
      client.transactions.create({
        organizationId: "org_001",
        walletId: "wallet_001",
        asset: "USDC",
        amount: "",
        network: "base-sepolia",
        destinationAddress: "0x1111111111111111111111111111111111111111"
      })
    ).rejects.toBeInstanceOf(En3ValidationError);

    await expect(client.wallets.get("wallet_001")).rejects.toBeInstanceOf(En3AuthenticationError);
    expectCall(fetchMock, 0, "POST", "/transactions", {
      organizationId: "org_001",
      walletId: "wallet_001",
      asset: "USDC",
      amount: "12500.00",
      network: "base-sepolia",
      destinationAddress: "0x1111111111111111111111111111111111111111",
      idempotencyKey: "partner-txn-0001"
    });
    expectCall(fetchMock, 1, "POST", "/transactions/txn_001/simulate");
    expectCall(fetchMock, 2, "POST", "/transactions/txn_001/approve", {
      decidedBy: "admin_001",
      decision: "approve"
    });
  });

  it("creates policies and webhook endpoints and lists audit events", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(policy(), 201))
      .mockResolvedValueOnce(jsonResponse({ items: [auditEvent()] }, 200))
      .mockResolvedValueOnce(jsonResponse(webhookEndpoint(), 201));

    const client = testClient(fetchMock);

    await expect(
      client.policies.create({
        organizationId: "org_001",
        name: "High value stablecoin transfer approval",
        rules: [{ type: "transaction_amount", asset: "USDC", threshold: "10000.00", action: "require_approval" }]
      })
    ).resolves.toMatchObject({ id: "policy_001", status: "active" });

    await expect(client.auditEvents.list({ organizationId: "org_001" })).resolves.toMatchObject({
      items: [{ id: "audit_001" }]
    });
    await expect(
      client.webhookEndpoints.create({
        organizationId: "org_001",
        url: "https://example.invalid/en3/webhooks",
        events: ["transaction.settled"]
      })
    ).resolves.toMatchObject({ id: "wh_001", status: "active" });

    expectCall(fetchMock, 0, "POST", "/policies", {
      organizationId: "org_001",
      name: "High value stablecoin transfer approval",
      rules: [{ type: "transaction_amount", asset: "USDC", threshold: "10000.00", action: "require_approval" }]
    });
    expect(fetchMock.mock.calls[1]?.[0]).toBe(`${baseUrl}/audit-events?organizationId=org_001`);
    expectCall(fetchMock, 2, "POST", "/webhook-endpoints", {
      organizationId: "org_001",
      url: "https://example.invalid/en3/webhooks",
      events: ["transaction.settled"]
    });
  });

  it("wraps fetch failures in En3NetworkError", async () => {
    fetchMock.mockRejectedValueOnce(new Error("socket closed"));

    await expect(testClient(fetchMock).wallets.get("wallet_001")).rejects.toBeInstanceOf(En3NetworkError);
  });
});

function testClient(fetchMock: ReturnType<typeof vi.fn>): En3Client {
  return new En3Client({
    apiKey: "sandbox-token",
    baseUrl: `${baseUrl}/`,
    environment: "sandbox",
    fetch: fetchMock as FetchLike
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function expectCall(fetchMock: ReturnType<typeof vi.fn>, index: number, method: string, path: string, body?: unknown): void {
  const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];
  expect(url).toBe(`${baseUrl}${path}`);
  expect(init.method).toBe(method);
  expect(new Headers(init.headers).get("authorization")).toBe("Bearer sandbox-token");

  if (body === undefined) {
    expect(init.body).toBeUndefined();
  } else {
    expect(new Headers(init.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(init.body as string)).toEqual(body);
  }
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

function policy() {
  return {
    id: "policy_001",
    organizationId: "org_001",
    name: "High value stablecoin transfer approval",
    status: "active",
    rules: [{ type: "transaction_amount", asset: "USDC", threshold: "10000.00", action: "require_approval" }]
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
    events: ["transaction.settled"],
    status: "active"
  };
}
