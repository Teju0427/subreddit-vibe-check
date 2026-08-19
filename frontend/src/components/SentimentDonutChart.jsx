import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  positive: "#34d399",
  neutral: "#94a3b8",
  negative: "#fb7185",
};

const LABELS = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

function SentimentDonutChart({ summary }) {
  const { counts, percentages, total } = summary;

  const data = ["positive", "neutral", "negative"].map((key) => ({
    key,
    name: LABELS[key],
    value: counts[key],
    percent: percentages[key],
  }));

  return (
    <div className="panel">
      <div className="panel-title">Sentiment Split</div>
      <div className="panel-subtitle">Share of the {total} analyzed titles</div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} posts (${props.payload.percent}%)`,
                name,
              ]}
              contentStyle={{
                background: "#171b24",
                border: "1px solid #262b38",
                borderRadius: 8,
                fontSize: 13,
              }}
              itemStyle={{ color: "#e9ecf3" }}
              labelStyle={{ color: "#9aa3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="legend-row">
        {data.map((entry) => (
          <div className="legend-item" key={entry.key}>
            <span
              className="legend-swatch"
              style={{ background: COLORS[entry.key] }}
            />
            {entry.name} — {entry.percent}%
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentDonutChart;
