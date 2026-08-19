// Reddit subreddit names: 3-21 chars, letters/numbers/underscores.
const SUBREDDIT_NAME_PATTERN = /^[A-Za-z0-9_]{3,21}$/;

/**
 * Validates and normalizes the `:subreddit` route param.
 * Strips a leading "r/" or "/r/" if the user typed the full path, then
 * checks the remaining name against Reddit's naming rules.
 */
function validateSubreddit(req, res, next) {
  const raw = req.params.subreddit || "";
  const normalized = raw.trim().replace(/^\/?r\//i, "");

  if (!normalized) {
    return res.status(400).json({
      error: "MISSING_SUBREDDIT",
      message: "Please enter a subreddit name.",
    });
  }

  if (!SUBREDDIT_NAME_PATTERN.test(normalized)) {
    return res.status(400).json({
      error: "INVALID_SUBREDDIT",
      message:
        "That doesn't look like a valid subreddit name. Use 3-21 letters, numbers, or underscores.",
    });
  }

  req.params.subreddit = normalized;
  next();
}

export { validateSubreddit };
