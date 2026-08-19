import { Router } from "express";
import { fetchHotPosts } from "../services/reddit.service.js";
import { getMockHotPosts } from "../services/mockData.service.js";
import { validateSubreddit } from "../middleware/validateSubreddit.js";
import { shapePost } from "../utils/shapePost.js";
import {
  getCachedPosts,
  setCachedPosts,
} from "../services/cache.service.js";

const router = Router();
const POST_LIMIT = 50;

// GET /api/subreddit/:subreddit/hot
router.get("/:subreddit/hot", validateSubreddit, async (req, res, next) => {
  const { subreddit } = req.params;
  const useMock = process.env.USE_MOCK_DATA === "true";

  try {
    // Check whether this subreddit already exists in the cache.
    const cachedPosts = getCachedPosts(subreddit);

    if (cachedPosts) {
      return res.json({
        subreddit,
        source: useMock ? "mock-cache" : "reddit-cache",
        fetchedAt: new Date().toISOString(),
        count: cachedPosts.length,
        posts: cachedPosts.map(shapePost),
        cached: true,
      });
    }

    // Fetch fresh data when there is no valid cached entry.
    const rawPosts = useMock
      ? getMockHotPosts(subreddit, POST_LIMIT)
      : await fetchHotPosts(subreddit, POST_LIMIT);

    if (!useMock && rawPosts.length === 0) {
      return res.status(404).json({
        error: "SUBREDDIT_NOT_FOUND",
        message: "This subreddit doesn't exist or has no posts.",
      });
    }

    // Store the fresh posts in the in-memory cache.
    setCachedPosts(subreddit, rawPosts);

    return res.json({
      subreddit,
      source: useMock ? "mock" : "reddit",
      fetchedAt: new Date().toISOString(),
      count: rawPosts.length,
      posts: rawPosts.map(shapePost),
      cached: false,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;