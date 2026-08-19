const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Custom error carrying a user-friendly message plus a machine-readable
 * code, so the UI can decide how to react without parsing strings.
 */
class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

/**
 * Fetches the top hot posts for a subreddit from our backend.
 * The backend handles all Reddit OAuth/API concerns; this function never
 * talks to Reddit directly and never sees any credentials.
 */
async function fetchSubredditHotPosts(subreddit) {
  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/subreddit/${encodeURIComponent(subreddit)}/hot`
    );
  } catch (networkErr) {
    throw new ApiError(
      "Can't reach the server. Check your connection and that the backend is running.",
      "NETWORK_ERROR"
    );
  }

  let body;
  try {
    body = await response.json();
  } catch (parseErr) {
    throw new ApiError(
      "Received an unexpected response from the server.",
      "PARSE_ERROR"
    );
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || "Unable to fetch this subreddit. Please check the subreddit name and try again.",
      body?.error || "UNKNOWN_ERROR"
    );
  }

  if (!Array.isArray(body.posts)) {
    throw new ApiError(
      "Received a malformed response from the server.",
      "MALFORMED_RESPONSE"
    );
  }

  return body;
}

/**
 * Checks backend health and reports whether it's running in mock mode.
 * Used to populate the header's status indicator on initial load, before
 * the user has searched for anything.
 */
async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export { fetchSubredditHotPosts, fetchHealth, ApiError };
