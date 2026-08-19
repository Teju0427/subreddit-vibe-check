const FILTERS = [
  { key: "all", label: "All" },
  { key: "positive", label: "Positive" },
  { key: "neutral", label: "Neutral" },
  { key: "negative", label: "Negative" },
];

function SentimentFilter({ activeFilter, onChange, counts, total }) {
  const countFor = (key) => (key === "all" ? total : counts[key]);

  return (
    <div className="filter-row" role="group" aria-label="Filter posts by sentiment">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className={`filter-chip${activeFilter === filter.key ? " active" : ""}`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
          <span className="count">({countFor(filter.key)})</span>
        </button>
      ))}
    </div>
  );
}

export default SentimentFilter;
