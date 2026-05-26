import type {
  Address,
  Approval,
  CreateAddressRequest,
  CreateWalletRequest,
  En3ClientConfig,
  ReconciliationReport,
  SubmitTransactionRequest,
  Transaction,
  TransactionSimulation,
  Wallet
} from "./types";

export class En3Client {
  constructor(private readonly config: En3ClientConfig) {}

  createWallet(input: CreateWalletRequest): Promise<Wallet> {
    return this.request("/wallets", { method: "POST", body: input });
  }

  getWallet(walletId: string): Promise<Wallet> {
    return this.request(`/wallets/${walletId}`, { method: "GET" });
  }

  createAddress(walletId: string, input: CreateAddressRequest): Promise<Address> {
    return this.request(`/wallets/${walletId}/addresses`, { method: "POST", body: input });
  }

  submitTransaction(input: SubmitTransactionRequest): Promise<Transaction> {
    return this.request("/transactions", { method: "POST", body: input });
  }

  simulateTransaction(transactionId: string): Promise<TransactionSimulation> {
    return this.request(`/transactions/${transactionId}/simulate`, { method: "POST" });
  }

  approveTransaction(transactionId: string, input: { decidedBy: string; decision: "approve" | "reject"; note?: string }): Promise<Approval> {
    return this.request(`/transactions/${transactionId}/approve`, { method: "POST", body: input });
  }

  getReconciliationReport(reportId: string): Promise<ReconciliationReport> {
    return this.request(`/reconciliation-reports/${reportId}`, { method: "GET" });
  }

  private async request<T>(path: string, options: { method: string; body?: unknown }): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: options.method,
      headers: {
        authorization: `Bearer ${this.config.token}`,
        "content-type": "application/json"
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    if (!response.ok) {
      throw new Error(`En3 sandbox request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
