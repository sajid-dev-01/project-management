import { HttpStatusCode } from "axios";

export class ApplicationError extends Error {
  public statusCode = HttpStatusCode.BadRequest;

  constructor(message = "Bad Request", options?: ErrorOptions) {
    super(message, options);
    this.name = "ApplicationError";
  }
}

export class AuthenticationError extends ApplicationError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
    this.statusCode = HttpStatusCode.Unauthorized;
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message = "Unauthorized action") {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = HttpStatusCode.Forbidden;
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = HttpStatusCode.NotFound;
  }
}

export class ValidationError extends ApplicationError {
  public fieldErrors: Record<string, string[] | undefined>;

  constructor(
    fieldErrors: Record<string, string[] | undefined>,
    message = "Validation failed!",
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
    this.statusCode = HttpStatusCode.BadRequest;
  }
}

export class TokenError extends ApplicationError {
  constructor(message = "Invalid code!") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export class RateLimitError extends ApplicationError {
  constructor(message = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
    this.statusCode = HttpStatusCode.Locked;
  }
}
