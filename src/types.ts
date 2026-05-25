export type OwnerType = "user" | "treasury" | "system";

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
  status: "submitted" | "requires_approval" | "approved" | "broadcast" | "settled" | "failed";
}

export interface TransactionSimulation {
  transactionId: string;
  result: "allowed" | "approval_required" | "blocked";
  estimatedFee: string;
  policyResult: string;
  riskSignals: string[];
}

export interface WebhookEvent<T = Record<string, unknown>> {
  id: string;
  type: string;
  createdAt: string;
  organizationId: string;
  data?: T;
}
