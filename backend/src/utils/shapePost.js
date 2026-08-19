/**
 * Picks only the fields the frontend actually needs from a raw Reddit (or
 * mock) post object, so we never leak unnecessary Reddit API data.
 */
function shapePost(post) {
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    score: post.score,
    num_comments: post.num_comments,
    created_utc: post.created_utc,
    permalink: post.permalink?.startsWith("http")
      ? post.permalink
      : `https://www.reddit.com${post.permalink}`,
    url: post.url,
    subreddit: post.subreddit,
    thumbnail:
      post.thumbnail && post.thumbnail.startsWith("http")
        ? post.thumbnail
        : null,
  };
}

export { shapePost };
