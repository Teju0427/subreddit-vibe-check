// Clamp range used to position the marker along the gradient track.
// Title-length text scored by the `sentiment` package rarely swings past
// this range, so it gives a stable, readable meter.
const CLAMP_RANGE = 5;

function positionForScore(score) {
  const clamped = Math.max(-CLAMP_RANGE, Math.min(CLAMP_RANGE, score));
  return ((clamped + CLAMP_RANGE) / (CLAMP_RANGE * 2)) * 100;
}

function moodLabel(score) {
  if (score > 1) return "Upbeat";
  if (score > 0) return "Mildly positive";
  if (score === 0) return "Even";
  if (score > -1) return "Mildly negative";
  return "Tense";
}

function VibeMeter({ averageScore, subreddit }) {
  const position = positionForScore(averageScore);

  return (
    <div className="vibe-meter">
      <div className="vibe-meter-top">
        <div>
          <span className="section-label">Overall Vibe · r/{subreddit}</span>
          <div className="vibe-meter-score">
            {averageScore > 0 ? "+" : ""}
            {averageScore.toFixed(2)}
          </div>
        </div>
        <span className="section-label" style={{ color: "var(--text-secondary)" }}>
          {moodLabel(averageScore)}
        </span>
      </div>

      <div className="vibe-track">
        <div className="vibe-marker" style={{ left: `${position}%` }} />
      </div>
      <div className="vibe-labels">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  );
}

export default VibeMeter;
