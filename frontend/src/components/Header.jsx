function Header({ mockMode }) {
  const knownState = mockMode !== null;

  return (
    <header className="header">
      <div className="container header-row">
        <div>
          <h1 className="header-title">
            <span className="mark" aria-hidden="true" />
            The Subreddit Vibe Check
          </h1>
          <p className="header-subtitle">Analyze the mood of a subreddit</p>
        </div>

        {knownState && (
          <span className={`status-pill ${mockMode ? "mock" : "connected"}`}>
            <span className="dot" />
            {mockMode ? "Development Mode" : "API Connected"}
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
