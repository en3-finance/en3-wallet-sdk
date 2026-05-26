export type En3Environment = "sandbox" | "local";

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface En3ClientConfig {
  apiKey: string;
  baseUrl: string;
  environment: En3Environment;
  fetch?: FetchLike;
}

export type OwnerType = "user" | "treasury" | "system";

export type OrganizationStatus = "sandbox_active" | "suspended";

export interface Organization {
  id: string;
  name: string;
  status: OrganizationStatus;
  createdAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
}

export type UserStatus = "active" | "restricted" | "closed";

export interface User {
  id: string;
  organizationId: string;
  externalUserId: string;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserRequest {
  organizationId: string;
  externalUserId: string;
}

export type WalletStatus = "active" | "frozen" | "closed";

export interface Balance {
  asset: string;
  network: string;
  available: string;
  pending: string;
}

export interface Wallet {
  id: string;
  organizationId: string;
  ownerType: OwnerType;
  ownerId: string;
  status: WalletStatus;
  balances: Balance[];
}

export interface CreateWalletRequest {
  organizationId: string;
  ownerType: OwnerType;
  ownerId: string;
}

export type AddressStatus = "active" | "archived";

export interface Address {
  id: string;
  walletId: string;
  network: string;
  address: string;
  status: AddressStatus;
}

export interface CreateAddressRequest {
  network: string;
  asset: string;
}

export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionStatus =
  | "submitted"
  | "simulated"
  | "requires_approval"
  | "approved"
  | "broadcast"
  | "settled"
  | "failed";
export type PolicyResult = "pass" | "approval_required" | "review_required" | "blocked";

export interface Transaction {
  id: string;
  organizationId: string;
  walletId: string;
  type: TransactionType;
  asset: string;
  amount: string;
  network: string;
  destinationAddress?: string;
  status: TransactionStatus;
  policyResult?: PolicyResult;
  createdAt: string;
}

export interface CreateTransactionRequest {
  organizationId: string;
  walletId: string;
  asset: string;
  amount: string;
  network: string;
  destinationAddress: string;
  idempotencyKey?: string;
}

export type SubmitTransactionRequest = CreateTransactionRequest;

export type SimulationResult = "allowed" | "approval_required" | "review_required" | "blocked";

export interface TransactionSimulation {
  transactionId: string;
  result: SimulationResult;
  estimatedFee: string;
  policyResult: string;
  riskSignals?: string[];
}

export interface Approval {
  id: string;
  transactionId: string;
  status: "approved" | "rejected";
  decidedBy: string;
  note?: string;
  decidedAt: string;
}

export interface ApproveTransactionRequest {
  decidedBy: string;
  decision: "approve" | "reject";
  note?: string;
}

export type PolicyStatus = "draft" | "active" | "disabled";
export type PolicyAction = "allow" | "require_approval" | "require_review" | "block";

export interface PolicyRule {
  type?: string;
  action?: PolicyAction;
  threshold?: string;
  asset?: string;
  [key: string]: unknown;
}

export interface Policy {
  id: string;
  organizationId: string;
  name: string;
  status: PolicyStatus;
  rules: PolicyRule[];
}

export interface CreatePolicyRequest {
  organizationId: string;
  name: string;
  rules: PolicyRule[];
}

export type ActorType = "user" | "admin" | "system";

export interface AuditEvent {
  id: string;
  organizationId: string;
  actorType: ActorType;
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  createdAt: string;
}

export interface ListAuditEventsRequest {
  organizationId?: string;
}

export interface AuditEventList {
  items: AuditEvent[];
}

export interface WebhookEndpoint {
  id: string;
  organizationId: string;
  url: string;
  events: WebhookEventType[];
  status: "active" | "disabled";
}

export interface CreateWebhookEndpointRequest {
  organizationId: string;
  url: string;
  events: WebhookEventType[];
}

export type WebhookEventType =
  | "wallet.created"
  | "address.created"
  | "transaction.submitted"
  | "transaction.simulated"
  | "transaction.requires_approval"
  | "transaction.approved"
  | "transaction.broadcast"
  | "transaction.settled"
  | "transaction.failed"
  | "risk.review_required"
  | "reconciliation.report_updated"
  | "audit.event_recorded";

export interface WebhookEvent<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: WebhookEventType | string;
  createdAt: string;
  organizationId: string;
  data?: TData;
  [key: string]: unknown;
}

export type WebhookHeaders = Headers | Record<string, string | string[] | undefined>;

export interface WebhookVerificationInput {
  rawBody: string | Uint8Array;
  headers: WebhookHeaders;
  secret: string;
  toleranceSeconds?: number;
}

export interface CreateSandboxWebhookSignatureInput {
  rawBody: string | Uint8Array;
  timestamp: string;
  secret: string;
}
