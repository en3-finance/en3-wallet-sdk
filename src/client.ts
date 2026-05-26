import {
  En3ConfigurationError,
  En3NetworkError,
  createEn3ApiError
} from "./errors.js";
import {
  verifySandboxWebhookSignature
} from "./webhooks.js";
import type {
  Address,
  Approval,
  ApproveTransactionRequest,
  AuditEventList,
  CreateAddressRequest,
  CreateOrganizationRequest,
  CreatePolicyRequest,
  CreateTransactionRequest,
  CreateUserRequest,
  CreateWalletRequest,
  CreateWebhookEndpointRequest,
  En3ClientConfig,
  En3Environment,
  FetchLike,
  ListAuditEventsRequest,
  Organization,
  Policy,
  SubmitTransactionRequest,
  Transaction,
  TransactionSimulation,
  User,
  Wallet,
  WebhookEndpoint,
  WebhookEvent,
  WebhookVerificationInput
} from "./types.js";

type RequestOptions = {
  method: "GET" | "POST";
  body?: unknown;
  query?: Record<string, string | undefined>;
};

export class En3Client {
  readonly environment: En3Environment;
  readonly organizations = {
    create: (input: CreateOrganizationRequest): Promise<Organization> =>
      this.request("/organizations", { method: "POST", body: input })
  };
  readonly users = {
    create: (input: CreateUserRequest): Promise<User> =>
      this.request("/users", { method: "POST", body: input })
  };
  readonly wallets = {
    create: (input: CreateWalletRequest): Promise<Wallet> =>
      this.request("/wallets", { method: "POST", body: input }),
    get: (walletId: string): Promise<Wallet> =>
      this.request(`/wallets/${encodePath(walletId)}`, { method: "GET" }),
    createAddress: (walletId: string, input: CreateAddressRequest): Promise<Address> =>
      this.request(`/wallets/${encodePath(walletId)}/addresses`, { method: "POST", body: input })
  };
  readonly transactions = {
    create: (input: CreateTransactionRequest): Promise<Transaction> =>
      this.request("/transactions", { method: "POST", body: input }),
    simulate: (transactionId: string): Promise<TransactionSimulation> =>
      this.request(`/transactions/${encodePath(transactionId)}/simulate`, { method: "POST" }),
    approve: (transactionId: string, input: ApproveTransactionRequest): Promise<Approval> =>
      this.request(`/transactions/${encodePath(transactionId)}/approve`, { method: "POST", body: input })
  };
  readonly policies = {
    create: (input: CreatePolicyRequest): Promise<Policy> =>
      this.request("/policies", { method: "POST", body: input })
  };
  readonly auditEvents = {
    list: (input: ListAuditEventsRequest = {}): Promise<AuditEventList> =>
      this.request("/audit-events", { method: "GET", query: { organizationId: input.organizationId } })
  };
  readonly webhookEndpoints = {
    create: (input: CreateWebhookEndpointRequest): Promise<WebhookEndpoint> =>
      this.request("/webhook-endpoints", { method: "POST", body: input })
  };
  readonly webhooks = {
    verifySignature: <TEvent extends WebhookEvent = WebhookEvent>(
      input: WebhookVerificationInput
    ): TEvent => verifySandboxWebhookSignature<TEvent>(input)
  };

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: FetchLike;

  constructor(config: En3ClientConfig) {
    const apiKey = config.apiKey?.trim();
    const baseUrl = config.baseUrl?.trim();

    if (!apiKey) {
      throw new En3ConfigurationError("En3Client requires apiKey", {
        code: "missing_api_key"
      });
    }

    if (!baseUrl) {
      throw new En3ConfigurationError("En3Client requires baseUrl", {
        code: "missing_base_url"
      });
    }

    if (config.environment !== "sandbox" && config.environment !== "local") {
      throw new En3ConfigurationError("En3Client environment must be sandbox or local", {
        code: "invalid_environment"
      });
    }

    const fetchFn = config.fetch ?? globalThis.fetch?.bind(globalThis);

    if (!fetchFn) {
      throw new En3ConfigurationError("En3Client requires a fetch implementation", {
        code: "missing_fetch"
      });
    }

    this.apiKey = apiKey;
    this.baseUrl = normalizeBaseUrl(baseUrl);
    this.environment = config.environment;
    this.fetchFn = fetchFn;
  }

  createWallet(input: CreateWalletRequest): Promise<Wallet> {
    return this.wallets.create(input);
  }

  createAddress(walletId: string, input: CreateAddressRequest): Promise<Address> {
    return this.wallets.createAddress(walletId, input);
  }

  submitTransaction(input: SubmitTransactionRequest): Promise<Transaction> {
    return this.transactions.create(input);
  }

  simulateTransaction(transactionId: string): Promise<TransactionSimulation> {
    return this.transactions.simulate(transactionId);
  }

  approveTransaction(transactionId: string, input: ApproveTransactionRequest): Promise<Approval> {
    return this.transactions.approve(transactionId, input);
  }

  private async request<T>(path: string, options: RequestOptions): Promise<T> {
    const url = buildUrl(this.baseUrl, path, options.query);
    const headers = new Headers({
      accept: "application/json",
      authorization: `Bearer ${this.apiKey}`
    });

    const init: RequestInit = {
      method: options.method,
      headers
    };

    if (options.body !== undefined) {
      headers.set("content-type", "application/json");
      init.body = JSON.stringify(options.body);
    }

    let response: Response;

    try {
      response = await this.fetchFn(url, init);
    } catch (error) {
      throw new En3NetworkError("En3 sandbox request failed before receiving a response", {
        code: "network_error",
        cause: error
      });
    }

    const responseText = await response.text();

    if (!response.ok) {
      throw createEn3ApiError(response.status, parseResponseBody(responseText), responseText);
    }

    if (!responseText) {
      return undefined as T;
    }

    return parseResponseBody(responseText) as T;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();
  return `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
}

function parseResponseBody(responseText: string): unknown {
  if (!responseText) {
    return undefined;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

function encodePath(value: string): string {
  return encodeURIComponent(value);
}
