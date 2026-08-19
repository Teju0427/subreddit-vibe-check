import axios from "axios";

/**
 * Reddit API service.
 *
 * Responsible for:
 *  - obtaining a Reddit OAuth2 access token (client_credentials grant)
 *  - caching that token in memory until it is close to expiring
 *  - making authenticated requests to Reddit's Data API
 *
 * All Reddit-specific logic lives here so that if Reddit changes its API
 * surface, only this file needs to change.
 */

const REDDIT_AUTH_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_BASE = "https://oauth.reddit.com";

// In-memory token cache. A single backend process only needs one token,
// shared across all incoming requests, so a module-level variable is enough
// here — no database required.
let cachedToken = null;
let tokenExpiresAt = 0; // epoch ms

function getCredentials() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT;

  if (!clientId || !clientSecret || !userAgent) {
    throw new Error(
      "Reddit credentials are not configured. Set REDDIT_CLIENT_ID, " +
        "REDDIT_CLIENT_SECRET, and REDDIT_USER_AGENT, or enable USE_MOCK_DATA."
    );
  }

  return { clientId, clientSecret, userAgent };
}

/**
 * Returns a valid OAuth access token, reusing the cached one when possible.
 * Only requests a new token from Reddit when none is cached or the cached
 * one is about to expire.
 */
async function getAccessToken() {
  const now = Date.now();

  // 60 second safety buffer before actual expiry
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const { clientId, clientSecret, userAgent } = getCredentials();

  const response = await axios.post(
    REDDIT_AUTH_URL,
    new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    {
      auth: { username: clientId, password: clientSecret },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent,
      },
      timeout: 10_000,
    }
  );

  const { access_token, expires_in } = response.data;

  cachedToken = access_token;
  tokenExpiresAt = Date.now() + expires_in * 1000;

  return cachedToken;
}

/**
 * Fetches the top `limit` hot posts from a subreddit using an authenticated
 * request. Throws on network/auth errors so the caller (route handler) can
 * translate them into clean HTTP responses.
 */
async function fetchHotPosts(subreddit, limit = 50) {
  const { userAgent } = getCredentials();
  const token = await getAccessToken();

  const response = await axios.get(
    `${REDDIT_API_BASE}/r/${encodeURIComponent(subreddit)}/hot`,
    {
      params: { limit, raw_json: 1 },
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": userAgent,
      },
      timeout: 10_000,
    }
  );

  const children = response.data?.data?.children;

  if (!Array.isArray(children)) {
    const err = new Error("Malformed response from Reddit API");
    err.code = "MALFORMED_RESPONSE";
    throw err;
  }

  return children.map((child) => child.data);
}

export { fetchHotPosts };
