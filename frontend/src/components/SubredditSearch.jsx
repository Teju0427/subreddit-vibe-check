import { useState } from "react";

const QUICK_PICKS = ["nba", "technology", "gaming"];
const NAME_PATTERN = /^[A-Za-z0-9_]{3,21}$/;

function normalizeInput(value) {
  return value.trim().replace(/^\/?r\//i, "");
}

function SubredditSearch({ onSearch, isLoading }) {
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState("");

  function runSearch(rawValue) {
    const normalized = normalizeInput(rawValue);

    if (!normalized) {
      setValidationError("Enter a subreddit name before analyzing.");
      return;
    }

    if (!NAME_PATTERN.test(normalized)) {
      setValidationError(
        "Subreddit names use 3-21 letters, numbers, or underscores."
      );
      return;
    }

    setValidationError("");
    onSearch(normalized);
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(value);
  }

  function handleQuickPick(name) {
    setValue(name);
    setValidationError("");
    runSearch(name);
  }

  return (
    <div className="search-card">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrap">
          <span className="prefix" aria-hidden="true">
            r/
          </span>
          <input
            className={`search-input${validationError ? " invalid" : ""}`}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (validationError) setValidationError("");
            }}
            placeholder="Enter subreddit (e.g. nba, technology, gaming)"
            aria-label="Subreddit name"
            disabled={isLoading}
          />
        </div>
        <button className="search-button" type="submit" disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Subreddit"}
        </button>
      </form>

      {validationError && <p className="search-error">{validationError}</p>}

      <p className="search-hint">
        Accepts "nba" or "r/nba" — we'll pull the top 50 hot posts and score
        their mood.
      </p>

      <div className="quick-picks">
        {QUICK_PICKS.map((name) => (
          <button
            key={name}
            type="button"
            className="quick-pick"
            onClick={() => handleQuickPick(name)}
            disabled={isLoading}
          >
            r/{name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SubredditSearch;
