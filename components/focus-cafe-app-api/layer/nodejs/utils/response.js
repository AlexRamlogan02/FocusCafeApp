const baseHeaders = {
  "Content-Type": "application/json",
};

function withCors(headers = {}) {
  const origin = process.env.CORS_ALLOWED_ORIGIN || "*";
  return {
    ...baseHeaders,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    ...headers,
  };
}

function json(statusCode, payload, headers = {}) {
  return {
    statusCode,
    headers: withCors(headers),
    body: JSON.stringify(payload),
  };
}

function standardResponse({ success, code, message, data = {}, meta = {} }) {
  return { success, code, message, data, meta };
}

module.exports = {
  json,
  standardResponse,
};
