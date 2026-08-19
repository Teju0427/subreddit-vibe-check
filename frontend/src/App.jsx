import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import SubredditSearch from "./components/SubredditSearch.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { fetchSubredditHotPosts, fetchHealth, ApiError } from "./services/api.js";
import { analyzePosts, summarizeSentiment } from "./utils/sentiment.js";

function App() {
  const [mockMode, setMockMode] = useState(null); // null = unknown yet
  const [subreddit, setSubreddit] = useState("");
  const [posts, setPosts] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate the header's status pill as soon as the app loads, before any
  // search has been run.
  useEffect(() => {
    fetchHealth().then((health) => {
      if (health) setMockMode(health.mockMode);
    });
  }, []);

  async function handleSearch(name) {
    setIsLoading(true);
    setError(null);
    setSubreddit(name);

    try {
      const result = await fetchSubredditHotPosts(name);
      // Requirement 3: sentiment analysis happens here, client-side, on the
      // titles the backend returned — never on the backend.
      const analyzed = analyzePosts(result.posts);

      setPosts(analyzed);
      setFetchedAt(result.fetchedAt);
      setMockMode(result.source === "mock");
    } catch (err) {
      setPosts(null);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const summary = posts ? summarizeSentiment(posts) : null;

  return (
    <div className="app-shell">
      <Header mockMode={mockMode} />

      <main className="container app-main">
        <SubredditSearch onSearch={handleSearch} isLoading={isLoading} />

        {isLoading && <LoadingState subreddit={subreddit} />}

        {!isLoading && error && <ErrorMessage message={error} />}

        {!isLoading && !error && posts && (
          <Dashboard
            subreddit={subreddit}
            posts={posts}
            summary={summary}
            fetchedAt={fetchedAt}
          />
        )}

        {!isLoading && !error && !posts && (
          <p className="footer-note">
            Search a subreddit above to see its top 50 hot posts scored for sentiment.
          </p>
        )}
      </main>
    </div>
  );
}

export default App;
