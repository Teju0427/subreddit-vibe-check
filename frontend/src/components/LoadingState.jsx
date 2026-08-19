function LoadingState({ subreddit }) {
  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="loading-text">Analyzing r/{subreddit}...</p>
    </div>
  );
}

export default LoadingState;
