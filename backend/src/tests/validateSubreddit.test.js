import { describe, expect, it, vi } from "vitest";
import { validateSubreddit } from "../middleware/validateSubreddit.js";

function createMocks(subreddit) {
  const req = {
    params: {
      subreddit,
    },
  };

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  const next = vi.fn();

  return { req, res, next };
}

describe("validateSubreddit middleware", () => {
  it("accepts a valid subreddit name", () => {
    const { req, res, next } = createMocks("nba");

    validateSubreddit(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.params.subreddit).toBe("nba");
    expect(res.status).not.toHaveBeenCalled();
  });

  it("normalizes r/ prefix", () => {
    const { req, res, next } = createMocks("r/nba");

    validateSubreddit(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.params.subreddit).toBe("nba");
    expect(res.status).not.toHaveBeenCalled();
  });

  it("normalizes /r/ prefix case-insensitively", () => {
    const { req, res, next } = createMocks("/R/NBA");

    validateSubreddit(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.params.subreddit).toBe("NBA");
  });

  it("rejects an invalid subreddit name", () => {
    const { req, res, next } = createMocks("r/");

    validateSubreddit(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "MISSING_SUBREDDIT",
      message: "Please enter a subreddit name.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects names containing invalid characters", () => {
    const { req, res, next } = createMocks("nba-basketball");

    validateSubreddit(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "INVALID_SUBREDDIT",
      message:
        "That doesn't look like a valid subreddit name. Use 3-21 letters, numbers, or underscores.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects subreddit names shorter than 3 characters", () => {
    const { req, res, next } = createMocks("ab");

    validateSubreddit(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "INVALID_SUBREDDIT",
      message:
        "That doesn't look like a valid subreddit name. Use 3-21 letters, numbers, or underscores.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});