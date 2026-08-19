# The Subreddit Vibe Check

A full-stack dashboard that analyzes the mood of any subreddit. Enter a subreddit, pull its top 50 "Hot" posts, and see the sentiment of those post titles broken down with charts, filters, and a sortable table.

Built as a **SportsOrca Full Stack Developer take-home assignment**.

## 🚀 Live Demo

**Frontend:**  
https://subreddit-vibe-check-frontend.onrender.com

**GitHub Repository:**  
https://github.com/Teju0427/subreddit-vibe-check

> The deployed demo currently uses development mock data so the application can be demonstrated reliably without exposing Reddit API credentials. The backend also supports Reddit OAuth2 and live Reddit data when valid credentials are configured.

---

## 📌 Project Overview

The Subreddit Vibe Check allows a user to:

1. Enter or select a subreddit (`nba`, `r/nba` — both work).
2. Fetch the top 50 Hot posts through a backend API.
3. Run **client-side sentiment analysis** on the 50 post titles using the `sentiment` npm package.
4. View the results through an interactive dashboard containing summary metrics, charts, filters, and a sortable post table.
5. Open the original Reddit threads directly from the results.

The application intentionally keeps sentiment analysis on the frontend, while the backend is responsible for retrieving, validating, and shaping the subreddit data.

---

## ✨ Features

### Subreddit Analysis

- Accepts both `nba` and `r/nba` formats.
- Validates subreddit input.
- Fetches the top 50 Hot posts.
- Displays the time at which the data was fetched.

### Client-Side Sentiment Analysis

- Uses the `sentiment` npm package.
- Analyzes all 50 post titles in the browser.
- Classifies posts as:
  - Positive
  - Neutral
  - Negative
- Calculates the average sentiment score.

### Interactive Dashboard

- Overall subreddit vibe score.
- Positive / Neutral / Negative post counts.
- Sentiment percentages.
- Vibe meter showing the overall mood.
- Sentiment donut chart.
- Per-post sentiment distribution chart.
- Sentiment filters:
  - All
  - Positive
  - Neutral
  - Negative
- Sorting by:
  - Sentiment score
  - Comment count
  - Sentiment
- Sortable table containing the analyzed posts.
- Links back to the original Reddit threads.
- Responsive layout for smaller screens.

### Error Handling

The application provides user-friendly handling for common failure cases, including:

- Empty subreddit input.
- Invalid subreddit names.
- Subreddit not found.
- Backend/API connection failures.
- Network errors.
- Rate limiting.
- Malformed API responses.

Internal stack traces, OAuth tokens, and secrets are never exposed to the client.

---

## 🧪 Development Mock Mode

The application supports a development mock-data mode so the complete application can be tested without requiring live Reddit credentials.

When enabled:

- The backend generates 50 clearly fake Reddit-shaped posts.
- The API identifies the response as mock data.
- The frontend clearly indicates that sample data is being displayed.
- No Reddit credentials are required.

This makes the application easier to develop, test, and demonstrate while keeping private API credentials out of the frontend.

Live Reddit data can be enabled by setting:

```env
USE_MOCK_DATA=false
```

and providing valid Reddit credentials on the backend.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript / JSX
- Plain CSS
- Recharts
- sentiment

### Backend

- Node.js
- Express

### Reddit Integration

- Reddit OAuth2
- Reddit Data API
- Development mock-data service

### Deployment & Development

- Git
- GitHub
- VS Code
- Render

---

## 🏗️ Architecture

```text
Browser (React)
       │
       │ GET /api/subreddit/:subreddit/hot
       ▼
Backend (Express)
       │
       ├── Validation
       ├── Error handling
       ├── Reddit OAuth2
       │
       ▼
Reddit Data API
       │
       └── OR ── Mock Data Service
                    │
                    ▼
              50 Post Objects
                    │
                    ▼
             React Frontend
                    │
                    ▼
        Client-Side Sentiment Analysis
                    │
                    ▼
       Dashboard / Charts / Filters
```

The backend acts as a thin data layer. It handles subreddit requests and Reddit authentication, while the frontend performs sentiment analysis and derives the dashboard metrics from the returned posts.

This separation keeps the sentiment logic on the client as required by the assignment and prevents Reddit credentials from being exposed to the browser.

---

## 📂 Project Structure

```text
subreddit-vibe-check/
│
├── frontend/
│   └── src/
│       ├── components/       # Presentational and interactive components
│       ├── pages/            # Dashboard page
│       ├── services/         # API communication
│       ├── utils/            # Sentiment analysis utilities
│       ├── styles/           # Application styles
│       ├── App.jsx           # Application state and data flow
│       └── main.jsx
│
├── backend/
│   └── src/
│       ├── routes/           # Subreddit API routes
│       ├── services/         # Reddit and mock-data services
│       ├── middleware/       # Validation and error handling
│       ├── utils/            # Post shaping utilities
│       └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

From the project root, install the frontend and backend dependencies separately.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Setup

Create the backend environment file:

```text
backend/.env
```

Example:

```env
PORT=5000
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=SubredditVibeCheck/1.0 by your_reddit_username
USE_MOCK_DATA=true
CORS_ORIGIN=http://localhost:5173
```

Create the frontend environment file:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Never commit real `.env` files or API credentials.**

Only placeholder environment files should be committed to GitHub.

---

## ▶️ Running Locally

Start the backend and frontend in two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

---

## 🔴 Reddit API Setup

The backend supports Reddit OAuth2 for live Reddit data.

To configure live Reddit access:

1. Log into Reddit.
2. Create a Reddit application.
3. Obtain the client ID and client secret.
4. Add the credentials to `backend/.env`.
5. Configure a descriptive Reddit user agent.
6. Set:

```env
USE_MOCK_DATA=false
```

7. Restart the backend.

The Reddit client secret and OAuth token remain on the backend and are never sent to the frontend.

---

## ☁️ Deployment

The project is deployed as two separate services on Render.

### Backend

**Service:** `subreddit-vibe-check`

**URL:**

https://subreddit-vibe-check-bzpm.onrender.com

The backend runs as a Node.js web service.

### Frontend

**Service:** `subreddit-vibe-check-frontend`

**URL:**

https://subreddit-vibe-check-frontend.onrender.com

The frontend is built using Vite and served through the deployed Node.js service.

The deployed frontend communicates with the backend using:

```env
VITE_API_BASE_URL=https://subreddit-vibe-check-bzpm.onrender.com
```

The backend CORS configuration is set to allow requests from the deployed frontend.

---

## 🔒 Security

- Reddit client credentials remain on the backend.
- OAuth tokens are never exposed to the frontend.
- `.env` files are excluded from Git.
- API errors are converted into user-friendly messages.
- Stack traces and internal implementation details are not returned to users.
- The frontend communicates with the application's backend rather than directly exposing Reddit credentials.

---

## 🔮 Future Enhancements

The following are potential improvements for future versions:

- **Historical trend view** — store daily snapshots and visualize how a subreddit's mood changes over time.
- **Comment-level sentiment** — analyze top comments in addition to post titles.
- **Server-side caching** — cache frequently requested subreddit responses to reduce repeated API calls.
- **Automated tests** — add unit and integration tests for sentiment logic, validation, API routes, and error handling.
- **Advanced sentiment models** — experiment with more context-aware NLP models.
- **Saved analyses** — allow users to save and compare subreddit analyses.
- **Additional Reddit metrics** — include trends such as engagement, upvotes, comments, and historical changes.

---

## ✅ Project Status

### Completed

- Full-stack React + Express application
- Subreddit input and validation
- Top 50 Hot post retrieval architecture
- Reddit OAuth2 backend integration
- Development mock-data mode
- Client-side sentiment analysis
- Sentiment classification
- Vibe meter
- Summary metrics
- Interactive charts
- Sentiment filtering
- Sorting
- Reddit thread links
- Error handling
- Responsive UI
- GitHub repository
- Render deployment
- Public live demo

### Current Demo

The public deployment currently uses mock data to provide a reliable, credential-free demonstration.

The application architecture supports switching to live Reddit data through backend environment configuration without exposing Reddit credentials to the frontend.

---

## 👩‍💻 Author

**Tejaswini**

AI & Data Science Student  
Full-Stack & AI/Data Science Enthusiast
