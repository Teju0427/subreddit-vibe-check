import Sentiment from "sentiment";

// A single analyzer instance is reused across all posts — the `sentiment`
// package's Analyzer is stateless per call, so this is safe and avoids
// re-instantiating it 50 times.
const analyzer = new Sentiment();

/**
 * Classification rules (per assignment spec):
 *   score > 0  -> "positive"
 *   score < 0  -> "negative"
 *   score === 0 -> "neutral"
 */
function classify(score) {
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

/**
 * Runs client-side sentiment analysis on a single post title.
 * Returns the post enriched with `sentimentScore` and `sentimentLabel`.
 */
function analyzeTitle(title) {
  const result = analyzer.analyze(title || "");
  return {
    score: result.score,
    label: classify(result.score),
  };
}

/**
 * Runs sentiment analysis on every post's title (client-side, per the
 * assignment requirement) and returns a new array of posts enriched with
 * sentiment data. Does not mutate the input array.
 */
function analyzePosts(posts) {
  return posts.map((post) => {
    const { score, label } = analyzeTitle(post.title);
    return { ...post, sentimentScore: score, sentimentLabel: label };
  });
}

/**
 * Computes aggregate sentiment stats across a set of already-analyzed posts.
 */
function summarizeSentiment(analyzedPosts) {
  const total = analyzedPosts.length;
  const counts = { positive: 0, neutral: 0, negative: 0 };
  let scoreSum = 0;

  for (const post of analyzedPosts) {
    counts[post.sentimentLabel] += 1;
    scoreSum += post.sentimentScore;
  }

  const averageScore = total > 0 ? scoreSum / total : 0;

  const percentages = {
    positive: total > 0 ? Math.round((counts.positive / total) * 100) : 0,
    neutral: total > 0 ? Math.round((counts.neutral / total) * 100) : 0,
    negative: total > 0 ? Math.round((counts.negative / total) * 100) : 0,
  };

  return { total, counts, percentages, averageScore };
}

export { analyzeTitle, analyzePosts, summarizeSentiment };
