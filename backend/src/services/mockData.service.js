/**
 * Development/mock data service.
 *
 * Used only when USE_MOCK_DATA=true. Generates 50 clearly-fake, Reddit-shaped
 * posts so the rest of the app (sentiment analysis, charts, table, filters)
 * can be built and tested without live Reddit credentials.
 *
 * This data is never presented to the frontend as real Reddit data — the
 * route handler that calls this service always tags the response with
 * `source: "mock"`, and the frontend shows a "Development Mode" indicator
 * whenever that flag is set.
 */

const TITLE_TEMPLATES = [
  "This might be the best {topic} performance I've ever seen",
  "Why does everyone hate {topic} lately? I don't get it",
  "Official discussion thread: {topic}",
  "{topic} absolutely blew it tonight, what a disaster",
  "Underrated take: {topic} is actually pretty solid this season",
  "Breaking: major update regarding {topic}",
  "I'm so tired of the constant complaining about {topic}",
  "This {topic} moment gave me chills, incredible stuff",
  "Can we talk about how bad {topic} has been recently?",
  "Neutral analysis: what the numbers say about {topic}",
  "{topic} fans are the most passionate community here, love it",
  "Genuinely worried about the direction {topic} is heading",
  "Highlight reel: {topic} at its absolute peak",
  "Unpopular opinion about {topic} that I stand by",
  "{topic} just announced something big, thoughts?",
  "This is why {topic} is overrated, change my mind",
  "Incredible comeback from {topic}, did not see that coming",
  "{topic} rumors are getting out of hand honestly",
  "A calm, measured look at {topic} this week",
  "Absolutely devastated by what happened with {topic}",
];

const TOPICS = [
  "the starting lineup",
  "the front office",
  "last night's game",
  "the trade deadline",
  "the new signing",
  "the coaching staff",
  "the rookie class",
  "the playoff race",
  "the fanbase",
  "the broadcast crew",
  "the schedule",
  "the rival matchup",
  "the injury report",
  "the draft picks",
  "the season opener",
];

function seededPick(arr, seed) {
  return arr[seed % arr.length];
}

/**
 * Generates `count` mock posts shaped like Reddit's post data, scoped to the
 * given subreddit name so the sample feels contextual.
 */
function getMockHotPosts(subreddit, count = 50) {
  const now = Math.floor(Date.now() / 1000);

  return Array.from({ length: count }, (_, i) => {
    const seed = i + subreddit.length;
    const template = seededPick(TITLE_TEMPLATES, seed);
    const topic = seededPick(TOPICS, seed * 3 + 7);
    const title = template.replace("{topic}", topic);

    return {
      id: `mock_${subreddit}_${i}`,
      title,
      author: `sample_user_${(seed % 37) + 1}`,
      score: Math.floor(Math.abs(Math.sin(seed) * 9000)) + 5,
      num_comments: Math.floor(Math.abs(Math.cos(seed) * 800)) + 1,
      created_utc: now - i * 900,
      permalink: `/r/${subreddit}/comments/mock${i}/sample_post/`,
      url: `https://www.reddit.com/r/${subreddit}/comments/mock${i}/sample_post/`,
      subreddit,
      thumbnail: "self",
    };
  });
}

export { getMockHotPosts };
