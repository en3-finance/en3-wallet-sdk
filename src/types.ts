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
  mode?: "sandbox";
  status: OrganizationStatus;
  createdAt: string;
  reconciliation?: ReconciliationEntry;
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

export type WalletStatus = "created" | "address_issued" | "active" | "suspended" | "closed";

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
  createdAt: string;
  balances?: Balance[];
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
  organizationId: string;
  assetCode: string;
  networkCode: string;
  address: string;
  status: AddressStatus;
  createdAt: string;
}

export interface CreateAddressRequest {
  organizationId: string;
  assetCode: string;
  networkCode: string;
}

export type TransactionType = "withdrawal" | "transfer";
export type TransactionStatus =
  | "submitted"
  | "simulated"
  | "requires_approval"
  | "approved"
  | "signing"
  | "signed"
  | "broadcast"
  | "settled"
  | "failed"
  | "cancelled";

export interface Transaction {
  id: string;
  organizationId: string;
  walletId: string;
  type: TransactionType;
  assetCode: string;
  amount: string;
  networkCode: string;
  destinationAddress?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface CreateTransactionRequest {
  organizationId: string;
  walletId: string;
  type: TransactionType;
  assetCode: string;
  amount: string;
  networkCode: string;
  destinationAddress: string;
  idempotencyKey?: string;
}

export type SubmitTransactionRequest = CreateTransactionRequest;

export type SimulationResult = "allowed" | "approval_required" | "review_required" | "blocked";
export type RiskDecision = "allow" | "review_required" | "block";

export interface TransactionSimulation {
  id: string;
  transactionId: string;
  estimatedFee: string;
  policyDecision: PolicyDecision;
  riskReview: RiskReview;
  transactionStatus: TransactionStatus;
}

export interface PolicyDecision {
  id: string;
  policyId: string;
  transactionId: string;
  outcome: SimulationResult;
}

export interface RiskReview {
  id: string;
  transactionId: string;
  decision: RiskDecision;
  signals: string[];
  vendorIntegration: false;
}

export interface Approval {
  id: string;
  organizationId: string;
  transactionId: string;
  status: "not_required" | "pending" | "approved" | "rejected" | "expired";
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
  approvalThreshold: string;
  blockThreshold: string;
  createdAt: string;
}

export interface CreatePolicyRequest {
  organizationId: string;
  name: string;
  approvalThreshold: string;
  blockThreshold: string;
}

export type ActorType = "user" | "admin" | "system";

export interface AuditEvent {
  id: string;
  organizationId: string;
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
  lastDeliveryStatus?: "pending" | "delivered" | "failed" | "retrying";
  createdAt: string;
}

export interface CreateWebhookEndpointRequest {
  organizationId: string;
  url: string;
  events: WebhookEventType[];
}

export type WebhookEventType =
  | "wallet.created"
  | "address.created"
  | "policy.created"
  | "organization.created"
  | "user.created"
  | "transaction.submitted"
  | "transaction.simulated"
  | "transaction.requires_approval"
  | "transaction.approved"
  | "transaction.signing"
  | "transaction.signed"
  | "transaction.broadcast"
  | "transaction.settled"
  | "transaction.failed"
  | "audit.event_created"
  | "reconciliation.updated";

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

export type ReconciliationStatus = "pending" | "matched" | "exception" | "resolved";

export interface ReconciliationEntry {
  id: string;
  organizationId: string;
  transactionId: string;
  status: ReconciliationStatus;
  mockReferenceOnly: true;
  updatedAt: string;
}
