import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

const COLORS = {
  positive: "#34d399",
  neutral: "#94a3b8",
  negative: "#fb7185",
};

function SentimentDistributionChart({ posts }) {
  const data = posts.map((post, i) => ({
    index: i + 1,
    score: post.sentimentScore,
    label: post.sentimentLabel,
    title: post.title,
  }));

  return (
    <div className="panel">
      <div className="panel-title">Sentiment Distribution</div>
      <div className="panel-subtitle">
        Score per post, in the order Reddit returned them
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="index"
              tick={{ fontSize: 11, fill: "#626b80" }}
              axisLine={{ stroke: "#262b38" }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#626b80" }}
              axisLine={{ stroke: "#262b38" }}
              tickLine={false}
              width={30}
            />
            <ReferenceLine y={0} stroke="#262b38" />
            <Tooltip
              labelFormatter={(index) => `Post #${index}`}
              formatter={(value, _name, props) => [
                `Score ${value}`,
                props.payload.title.length > 60
                  ? props.payload.title.slice(0, 60) + "…"
                  : props.payload.title,
              ]}
              contentStyle={{
                background: "#171b24",
                border: "1px solid #262b38",
                borderRadius: 8,
                fontSize: 12,
                maxWidth: 260,
              }}
              itemStyle={{ color: "#e9ecf3" }}
              labelStyle={{ color: "#9aa3b8" }}
            />
            <Bar dataKey="score" radius={[3, 3, 3, 3]} maxBarSize={14}>
              {data.map((entry) => (
                <Cell key={entry.index} fill={COLORS[entry.label]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SentimentDistributionChart;
