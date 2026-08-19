/**
 * Central error handler. Logs the real error server-side for debugging, but
 * only ever sends a safe, friendly message to the client — never a stack
 * trace, internal error string, or credential-related detail.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error("[error]", err.message);

  const status = err.response?.status;

  if (status === 404) {
    return res.status(404).json({
      error: "SUBREDDIT_NOT_FOUND",
      message: "This subreddit doesn't exist or has no posts.",
    });
  }

  if (status === 403) {
    return res.status(403).json({
      error: "SUBREDDIT_PRIVATE_OR_BANNED",
      message: "This subreddit is private, quarantined, or banned.",
    });
  }

  if (status === 429) {
    return res.status(429).json({
      error: "RATE_LIMITED",
      message: "Reddit is rate-limiting requests right now. Please try again shortly.",
    });
  }

  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return res.status(504).json({
      error: "UPSTREAM_TIMEOUT",
      message: "Reddit took too long to respond. Please try again.",
    });
  }

  if (err.code === "MALFORMED_RESPONSE") {
    return res.status(502).json({
      error: "MALFORMED_RESPONSE",
      message: "Received an unexpected response from Reddit. Please try again.",
    });
  }

  if (err.message?.includes("Reddit credentials are not configured")) {
    return res.status(503).json({
      error: "SERVICE_UNAVAILABLE",
      message:
        "The server isn't configured to reach Reddit right now. Try again later.",
    });
  }

  return res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "Something went wrong on our end. Please try again.",
  });
}

export { errorHandler };
