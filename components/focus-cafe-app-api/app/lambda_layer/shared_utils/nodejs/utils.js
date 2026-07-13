const defaultSecurityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
};

function parseAllowedOrigins() {
  const raw = process.env.CORS_ALLOWED_ORIGINS || "*";
  return raw.split(",").map((origin) => origin.trim()).filter(Boolean);
}

function resolveCorsOrigin(event) {
  const allowedOrigins = parseAllowedOrigins();
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin;

  if (allowedOrigins.includes("*")) {
    return "*";
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] || "*";
}

function withCors(headers = {}, event = null) {
  const origin = resolveCorsOrigin(event);
  return {
    ...defaultSecurityHeaders,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    ...headers,
  };
}

function json(statusCode, payload, headers = {}, event = null) {
  return {
    statusCode,
    headers: withCors(headers, event),
    body: JSON.stringify(payload),
  };
}

function standardResponse({ success, code, message, data = {}, meta = {} }) {
  return { success, code, message, data, meta };
}

function makeError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function validateRequiredFields(payload = {}, requiredFields = []) {
  const missing = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null);
  if (missing.length > 0) {
    throw makeError(400, "MISSING_REQUIRED_FIELDS", `Missing required fields: ${missing.join(", ")}`);
  }
}

function validateNoUnknownFields(payload = {}, allowedFields = []) {
  const unknown = Object.keys(payload).filter((field) => !allowedFields.includes(field));
  if (unknown.length > 0) {
    throw makeError(400, "UNKNOWN_FIELDS", `Unknown fields are not allowed: ${unknown.join(", ")}`);
  }
}

module.exports = {
  json,
  standardResponse,
  makeError,
  validateRequiredFields,
  validateNoUnknownFields,
};
