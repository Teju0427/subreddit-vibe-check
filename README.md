# The Subreddit Vibe Check

A full-stack dashboard that analyzes the mood of any subreddit. Enter a
subreddit, pull its top 50 "Hot" posts from Reddit, and see the sentiment of
those post titles broken down with charts, filters, and a sortable table.

Built as a SportsOrca Full Stack Developer take-home assignment.

## Project Overview

The Subreddit Vibe Check lets a user:

1. Enter or select a subreddit (`nba`, `r/nba` — both work).
2. Fetch the top 50 Hot posts from `/r/{subreddit}/hot` via a backend that
   handles Reddit's OAuth2 flow.
3. Run **client-side** sentiment analysis on the 50 post titles using the
   `sentiment` npm package.
4. View the results on a dashboard: summary cards, a sentiment donut chart, a
   per-post distribution chart, and a filterable, sortable table of every
   post — with links back to the original Reddit thread.
     import pypandoc
from pathlib import Path

readme = r"""# The Subreddit Vibe Check

A full-stack web application that analyzes the mood of a subreddit by fetching its top 50 **Hot** posts and performing client-side sentiment analysis on their titles.

Built as a **SportsOrca Full Stack Developer take-home assignment**.

## Live Demo

**Frontend:**  
https://subreddit-vibe-check-frontend.onrender.com

> **Demo note:** The deployed version currently runs in development mock-data mode. This keeps the public demo reliable without exposing Reddit API credentials. The application also supports Reddit OAuth2 and live Reddit data when valid backend credentials are configured.

---

## Overview

**The Subreddit Vibe Check** turns a subreddit into a simple, visual sentiment dashboard.

A user can enter a subreddit such as `nba` or `r/nba`, fetch the top 50 Hot posts, analyze the sentiment of their titles, and explore the results through summary metrics, charts, filters, sorting, and links to the original Reddit posts.

The project is designed around a clear separation of responsibilities:

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │                     │
                    │  • User input       │
                    │  • Sentiment        │
                    │  • Charts           │
                    │  • Filters          │
                    │  • Sorting          │
                    └──────────┬──────────┘
                               │
                               │ GET /api/subreddit/:subreddit/hot
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │  • Validation       │
                    │  • API handling     │
                    │  • OAuth2           │
                    │  • Error handling   │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Reddit Data API     │
                    │        or           │
                    │ Mock Data Service   │
                    └─────────────────────┘


## Features

- Subreddit input with validation (empty input, invalid names, `r/` prefix
  handling)
- Backend-managed Reddit OAuth2 (client-credentials flow) with in-memory
  token caching — no unnecessary token requests
- Development **mock mode** for working without live Reddit credentials,
  clearly labeled as sample data everywhere it appears
- Client-side sentiment scoring and classification (Positive / Neutral /
  Negative) on all 50 titles
- Summary cards: total posts, positive/neutral/negative counts, average
  sentiment score
- "Vibe meter" — a single gradient readout of the subreddit's overall mood
- Sentiment donut chart with dynamic percentages
- Bar chart of per-post sentiment scores
- Sentiment filters with live counts (`All / Positive / Neutral / Negative`)
- Sorting by score, comment count, or sentiment
- Responsive layout, no horizontal overflow, down to mobile
- Friendly error handling for every failure mode (invalid subreddit, subreddit
  not found, rate limiting, network errors, backend down, malformed
  responses) — no stack traces or secrets ever reach the client

## Tech Stack

**Frontend:** React, Vite, plain CSS, Recharts, `sentiment`
**Backend:** Node.js, Express
**Reddit access:** Reddit OAuth2 (client-credentials) + Reddit Data API

## Architecture

```
Browser (React)
   │  GET /api/subreddit/:subreddit/hot
   ▼
Backend (Express)
   │  OAuth2 client-credentials grant (cached token)
   ▼
Reddit Data API  — or —  Mock data service (USE_MOCK_DATA=true)
```

The backend's only job is to authenticate with Reddit and return clean,
minimal JSON. It never touches sentiment. The frontend receives the 50 post
titles and runs `sentiment` on each one **in the browser**, then derives every
chart, card, and table row from that client-side analysis. This split is
intentional — the assignment specifically requires sentiment analysis to run
client-side, and keeping it there also means the backend stays a thin,
swappable data source (Reddit today, mock data in development, easily
another source later).

```
subreddit-vibe-check/
├── frontend/
│   └── src/
│       ├── components/     # presentational + interactive pieces
│       ├── pages/           # Dashboard.jsx composes the components
│       ├── services/        # api.js — talks to the backend only
│       ├── utils/            # sentiment.js — the `sentiment` package wrapper
│       ├── styles/          # tokens.css, base.css, components.css
│       ├── App.jsx          # owns fetch/analysis state
│       └── main.jsx
├── backend/
│   └── src/
│       ├── routes/           # /api/subreddit/:subreddit/hot
│       ├── services/         # reddit.service.js (OAuth), mockData.service.js
│       ├── middleware/       # validateSubreddit.js, errorHandler.js
│       ├── utils/            # shapePost.js
│       └── server.js
├── .gitignore
└── README.md
```

## Installation

From the project root, install each half separately (they have independent
`package.json` files):

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Setup

Copy the example env files and fill them in:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`:

```
PORT=5000
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=SubredditVibeCheck/1.0 by <your_reddit_username>
USE_MOCK_DATA=true
CORS_ORIGIN=http://localhost:5173
```

`frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Never commit `.env` — only `.env.example` (placeholders only) is tracked.

## Running Locally

Start the backend and frontend in two terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.
Open the frontend URL in your browser.

## Mock Mode

Set `USE_MOCK_DATA=true` in `backend/.env` to run the whole app without
Reddit credentials. The backend generates 50 clearly-fake, Reddit-shaped
posts per subreddit, tags the API response with `source: "mock"`, and the
frontend shows a **Development Mode — Sample Data** indicator whenever this
is active. Mock data is never presented as real Reddit data anywhere in the
app.

This exists because Reddit's app-registration flow can be flaky (this
project was built after Reddit returned an HTTP 500 while registering a new
OAuth app) — mock mode keeps the rest of the app fully buildable and
testable while that's sorted out.

Switch to live data at any time by setting `USE_MOCK_DATA=false` and
supplying real credentials — no other code changes required.

## Reddit API Setup

1. Log into Reddit and go to <https://www.reddit.com/prefs/apps>.
2. Click **create another app...**, choose **script**, and fill in a name
   and redirect URI (`http://localhost:5000` works for a script app).
3. Copy the client ID (under the app name) and secret into `backend/.env` as
   `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`.
4. Set `REDDIT_USER_AGENT` to something like
   `SubredditVibeCheck/1.0 by <your_reddit_username>` — Reddit requires a
   descriptive, unique user agent.
5. Set `USE_MOCK_DATA=false` and restart the backend.

## Deployment

**Backend:** deploy `backend/` to any Node host (Render, Railway, Fly.io,
etc.). Set the same environment variables from `backend/.env.example` in the
host's dashboard — never in code. Start command: `npm start`.

**Frontend:** build a static bundle and deploy it to any static host
(Vercel, Netlify, Cloudflare Pages):

```bash
cd frontend
npm run build
```

This outputs `frontend/dist/`. Set `VITE_API_BASE_URL` in the static host's
environment settings to your deployed backend's URL before building, and
update `CORS_ORIGIN` on the backend to match your deployed frontend's origin.

## Security

- The Reddit client secret and OAuth token never leave the backend — the
  frontend only ever calls our own API.
- `.env` is gitignored; only `.env.example` (placeholders) is committed.
- All Reddit-facing errors are translated into generic, friendly messages
  before reaching the client — no stack traces, tokens, or internal details
  are ever exposed.

## What I'd Extend Next

- **Historical trend view** — store daily snapshots (would need a small
  database) to chart how a subreddit's mood shifts over time, not just a
  single hot-posts snapshot.
- **Comment-level sentiment** — currently only titles are analyzed, per the
  assignment; scoring top comments would give a fuller picture.
- **Caching layer** — cache each subreddit's response for ~60 seconds
  server-side to reduce Reddit API calls under repeated searches.
- **Automated tests** — unit tests for `sentiment.js`'s classification logic
  and the backend's validation/error-handling middleware.
