import { Fragment } from "react";
import MetaBar from "../components/MetaBar.jsx";
import VibeMeter from "../components/VibeMeter.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import SentimentDonutChart from "../components/SentimentDonutChart.jsx";
import SentimentDistributionChart from "../components/SentimentDistributionChart.jsx";
import PostsTable from "../components/PostsTable.jsx";

function Dashboard({ subreddit, posts, summary, fetchedAt }) {
  return (
    <Fragment>
      <MetaBar subreddit={subreddit} count={posts.length} fetchedAt={fetchedAt} />

      <VibeMeter averageScore={summary.averageScore} subreddit={subreddit} />

      <SummaryCards summary={summary} />

      <div className="chart-grid">
        <SentimentDonutChart summary={summary} />
        <SentimentDistributionChart posts={posts} />
      </div>

      <PostsTable posts={posts} summary={summary} />
    </Fragment>
  );
}

export default Dashboard;
