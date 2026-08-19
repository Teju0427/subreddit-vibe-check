import { useState, useMemo } from "react";
import SentimentFilter from "./SentimentFilter.jsx";

const SORT_OPTIONS = [
  { key: "none", label: "Default order" },
  { key: "score-desc", label: "Score (high to low)" },
  { key: "comments-desc", label: "Comments (high to low)" },
  { key: "sentiment-desc", label: "Sentiment (positive first)" },
  { key: "sentiment-asc", label: "Sentiment (negative first)" },
];

function sortPosts(posts, sortKey) {
  const copy = [...posts];
  switch (sortKey) {
    case "score-desc":
      return copy.sort((a, b) => b.score - a.score);
    case "comments-desc":
      return copy.sort((a, b) => b.num_comments - a.num_comments);
    case "sentiment-desc":
      return copy.sort((a, b) => b.sentimentScore - a.sentimentScore);
    case "sentiment-asc":
      return copy.sort((a, b) => a.sentimentScore - b.sentimentScore);
    default:
      return copy;
  }
}

function PostsTable({ posts, summary }) {
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("none");

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.sentimentLabel === filter);
  }, [posts, filter]);

  const sorted = useMemo(() => sortPosts(filtered, sortKey), [filtered, sortKey]);

  return (
    <div className="panel">
      <div className="panel-title">Posts</div>
      <div className="panel-subtitle">
        Click any title to open the original post on Reddit
      </div>

      <div className="table-toolbar">
        <SentimentFilter
          activeFilter={filter}
          onChange={setFilter}
          counts={summary.counts}
          total={summary.total}
        />

        <select
          className="sort-select"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          aria-label="Sort posts"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-scroll">
        <table className="posts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Post Title</th>
              <th>Sentiment</th>
              <th>Score</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>No posts match this filter.</td>
              </tr>
            ) : (
              sorted.map((post, i) => (
                <tr key={post.id}>
                  <td className="col-index">{i + 1}</td>
                  <td className="col-title">
                    <a
                      className="title-link"
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={post.title}
                    >
                      {post.title}
                    </a>
                  </td>
                  <td>
                    <span className={`sentiment-badge ${post.sentimentLabel}`}>
                      <span className="dot" />
                      {post.sentimentLabel.charAt(0).toUpperCase() +
                        post.sentimentLabel.slice(1)}
                    </span>
                  </td>
                  <td className="col-numeric">{post.score.toLocaleString()}</td>
                  <td className="col-numeric">
                    {post.num_comments.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostsTable;
