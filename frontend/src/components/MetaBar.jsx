function MetaBar({ subreddit, count, fetchedAt }) {
  const time = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div className="meta-bar">
      <div>
        <span className="sub-name">r/{subreddit}</span>{" "}
        <span className="sub-meta">· {count} Hot Posts</span>
      </div>
      <span className="timestamp">Fetched at {time}</span>
    </div>
  );
}

export default MetaBar;
