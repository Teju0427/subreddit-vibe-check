function ErrorMessage({ message }) {
  return (
    <div className="error-card" role="alert">
      <span className="icon" aria-hidden="true">
        ⚠
      </span>
      <div>
        <p className="error-title">Unable to fetch this subreddit</p>
        <p className="error-message">
          {message ||
            "Please check the subreddit name and try again."}
        </p>
      </div>
    </div>
  );
}

export default ErrorMessage;
