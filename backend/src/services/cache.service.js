const cache = new Map();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedPosts(subreddit) {
  const key = subreddit.toLowerCase();
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.posts;
}

function setCachedPosts(subreddit, posts) {
  const key = subreddit.toLowerCase();

  cache.set(key, {
    posts,
    timestamp: Date.now(),
  });
}

function clearCache() {
  cache.clear();
}

export { getCachedPosts, setCachedPosts, clearCache };