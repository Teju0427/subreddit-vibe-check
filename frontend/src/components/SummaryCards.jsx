function SummaryCards({ summary }) {
  const { total, counts, percentages, averageScore } = summary;

  const cards = [
    {
      label: "Total Posts",
      value: total,
      sub: "Hot posts analyzed",
      color: "var(--accent)",
    },
    {
      label: "Positive",
      value: counts.positive,
      sub: `${percentages.positive}% of posts`,
      color: "var(--positive)",
    },
    {
      label: "Neutral",
      value: counts.neutral,
      sub: `${percentages.neutral}% of posts`,
      color: "var(--neutral)",
    },
    {
      label: "Negative",
      value: counts.negative,
      sub: `${percentages.negative}% of posts`,
      color: "var(--negative)",
    },
    {
      label: "Avg Sentiment Score",
      value: averageScore.toFixed(2),
      sub: averageScore >= 0 ? "Leaning positive" : "Leaning negative",
      color: "var(--warning)",
    },
  ];

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className="summary-card"
          style={{ "--accent-color": card.color }}
        >
          <div className="label">{card.label}</div>
          <div className="value">{card.value}</div>
          <div className="sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
