export interface En3ErrorOptions {
  code?: string;
  status?: number;
  requestId?: string;
  body?: unknown;
  responseText?: string;
  cause?: unknown;
}

export class En3Error extends Error {
  readonly code?: string;
  readonly status?: number;
  readonly requestId?: string;
  readonly body?: unknown;
  readonly responseText?: string;

  constructor(message: string, options: En3ErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.code = options.code;
    this.status = options.status;
    this.requestId = options.requestId;
    this.body = options.body;
    this.responseText = options.responseText;

    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export class En3ConfigurationError extends En3Error {}

export class En3ApiError extends En3Error {
  constructor(message: string, options: En3ErrorOptions & { status: number }) {
    super(message, options);
  }
}

export class En3AuthenticationError extends En3ApiError {}
export class En3AuthorizationError extends En3ApiError {}
export class En3ValidationError extends En3ApiError {}
export class En3RateLimitError extends En3ApiError {}
export class En3ServerError extends En3ApiError {}
export class En3NetworkError extends En3Error {}
export class En3WebhookVerificationError extends En3Error {}

interface ParsedErrorBody {
  code?: string;
  message?: string;
  error?: string;
  requestId?: string;
  [key: string]: unknown;
}

export function createEn3ApiError(status: number, body: unknown, responseText: string): En3ApiError {
  const parsed = isRecord(body) ? (body as ParsedErrorBody) : undefined;
  const code = typeof parsed?.code === "string" ? parsed.code : undefined;
  const requestId = typeof parsed?.requestId === "string" ? parsed.requestId : undefined;
  const message =
    (typeof parsed?.message === "string" && parsed.message) ||
    (typeof parsed?.error === "string" && parsed.error) ||
    `En3 sandbox request failed with status ${status}`;

  const options = {
    status,
    code,
    requestId,
    body,
    responseText
  };

  if (status === 401) {
    return new En3AuthenticationError(message, options);
  }

  if (status === 403) {
    return new En3AuthorizationError(message, options);
  }

  if (status === 400 || status === 422) {
    return new En3ValidationError(message, options);
  }

  if (status === 429) {
    return new En3RateLimitError(message, options);
  }

  if (status >= 500) {
    return new En3ServerError(message, options);
  }

  return new En3ApiError(message, options);
}

export function isEn3Error(error: unknown): error is En3Error {
  return error instanceof En3Error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
