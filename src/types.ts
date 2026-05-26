export type OwnerType = "user" | "treasury" | "system";
export type TransactionStatus = "submitted" | "simulated" | "requires_approval" | "approved" | "broadcast" | "settled" | "failed";
export type TransactionPolicyResult = "pass" | "approval_required" | "review_required" | "blocked";
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

export interface En3ClientConfig {
  baseUrl: string;
  token: string;
}

export interface CreateWalletRequest {
  organizationId: string;
  ownerType: OwnerType;
  ownerId: string;
}

export interface Wallet {
  id: string;
  organizationId: string;
  ownerType: OwnerType;
  ownerId: string;
  status: "active" | "frozen" | "closed";
}

export interface CreateAddressRequest {
  network: string;
  asset: string;
}

export interface Address {
  id: string;
  walletId: string;
  network: string;
  address: string;
  status: "active" | "archived";
}

export interface SubmitTransactionRequest {
  organizationId: string;
  walletId: string;
  asset: string;
  amount: string;
  network: string;
  destinationAddress: string;
  idempotencyKey?: string;
}

export interface Transaction {
  id: string;
  organizationId: string;
  walletId: string;
  type: "deposit" | "withdrawal" | "transfer";
  asset: string;
  amount: string;
  network: string;
  destinationAddress?: string;
  status: TransactionStatus;
  policyResult?: TransactionPolicyResult;
}

export interface TransactionSimulation {
  transactionId: string;
  result: "allowed" | "approval_required" | "review_required" | "blocked";
  estimatedFee: string;
  policyResult: TransactionPolicyResult;
  riskSignals: string[];
}

export interface Approval {
  id: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  decidedBy: string;
  note?: string;
  decidedAt?: string;
}

export interface ReconciliationReport {
  id: string;
  organizationId: string;
  status: "matched" | "exception";
  itemCount: number;
  items: Array<{
    transactionId: string;
    walletId: string;
    asset: string;
    amount: string;
    status: "matched" | "exception";
  }>;
  updatedAt: string;
}

export interface WebhookEvent<T = Record<string, unknown>> {
  id: string;
  type: WebhookEventType;
  createdAt: string;
  organizationId: string;
  data?: T;
}
