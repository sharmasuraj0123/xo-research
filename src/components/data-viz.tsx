/**
 * Self-contained SVG data-viz components for research briefs.
 *
 * These are pure server-rendered SVG (no client JS) so they work without
 * adding a charting library to package.json. For interactive viz, drop a
 * full Chart.js / D3 / Plotly file into the research area and pull it in
 * with <HtmlEmbed src="..." />.
 */

type MetrDoublingChartProps = {
  /**
   * Years to project. Default 6 (2025 to 2031).
   */
  years?: number;
  /**
   * Starting 50%-time-horizon in minutes. Default 60 (Claude 3.7 Sonnet).
   */
  startMinutes?: number;
  /**
   * Doubling period in months. Default 7 (METR's measured rate).
   */
  doublingMonths?: number;
  caption?: string;
};

/**
 * Renders METR's measured 7-month-doubling of the 50% task-completion time
 * horizon. Y-axis is logarithmic (minutes); X-axis is year.
 *
 * Source: https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/
 */
export function MetrDoublingChart({
  years = 6,
  startMinutes = 60,
  doublingMonths = 7,
  caption = "Projected 50% time horizon under METR's measured 7-month doubling",
}: MetrDoublingChartProps) {
  const width = 720;
  const height = 360;
  const padding = { top: 24, right: 32, bottom: 48, left: 64 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Build the doubling series: one point per month
  const totalMonths = years * 12;
  const points: { month: number; minutes: number }[] = [];
  for (let m = 0; m <= totalMonths; m++) {
    const minutes = startMinutes * 2 ** (m / doublingMonths);
    points.push({ month: m, minutes });
  }

  const maxMinutes = points[points.length - 1].minutes;
  const minMinutes = startMinutes;

  const xScale = (m: number) => (m / totalMonths) * plotWidth;
  const yScale = (mins: number) => {
    const logMin = Math.log10(minMinutes);
    const logMax = Math.log10(maxMinutes);
    const logVal = Math.log10(mins);
    return plotHeight - ((logVal - logMin) / (logMax - logMin)) * plotHeight;
  };

  const pathD = points
    .map((p, i) => {
      const x = xScale(p.month);
      const y = yScale(p.minutes);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  // Y-axis log ticks: 1h, 8h, 1d, 1w, 1mo
  const yTicks = [
    { minutes: 60, label: "1 hour" },
    { minutes: 60 * 8, label: "8 hours" },
    { minutes: 60 * 24, label: "1 day" },
    { minutes: 60 * 24 * 7, label: "1 week" },
    { minutes: 60 * 24 * 30, label: "1 month" },
  ].filter((t) => t.minutes >= minMinutes && t.minutes <= maxMinutes * 1.5);

  // X-axis year ticks
  const startYear = 2025;
  const xTicks = Array.from({ length: years + 1 }, (_, i) => ({
    month: i * 12,
    label: String(startYear + i),
  }));

  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg border border-fd-border bg-fd-background p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          role="img"
          aria-label={caption}
          style={{ display: "block" }}
        >
          <title>{caption}</title>
          {/* Plot background */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Y gridlines */}
            {yTicks.map((tick) => {
              const y = yScale(tick.minutes);
              return (
                <g key={`y-${tick.minutes}`}>
                  <line
                    x1={0}
                    x2={plotWidth}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={0.1}
                    strokeDasharray="2 4"
                  />
                  <text
                    x={-8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="currentColor"
                    opacity={0.6}
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* X gridlines + labels */}
            {xTicks.map((tick) => {
              const x = xScale(tick.month);
              return (
                <g key={`x-${tick.month}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={0}
                    y2={plotHeight}
                    stroke="currentColor"
                    strokeOpacity={0.05}
                  />
                  <text
                    x={x}
                    y={plotHeight + 18}
                    textAnchor="middle"
                    fontSize={11}
                    fill="currentColor"
                    opacity={0.6}
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={plotHeight}
              stroke="currentColor"
              strokeOpacity={0.4}
            />
            <line
              x1={0}
              y1={plotHeight}
              x2={plotWidth}
              y2={plotHeight}
              stroke="currentColor"
              strokeOpacity={0.4}
            />

            {/* Trend line */}
            <path
              d={pathD}
              fill="none"
              stroke="#83d63a"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Start + end markers */}
            <circle cx={0} cy={yScale(startMinutes)} r={4} fill="#83d63a" />
            <circle
              cx={plotWidth}
              cy={yScale(maxMinutes)}
              r={4}
              fill="#83d63a"
            />

            {/* Axis labels */}
            <text
              x={-padding.left + 12}
              y={-8}
              fontSize={11}
              fill="currentColor"
              opacity={0.7}
              fontWeight={500}
            >
              50% time horizon (log scale)
            </text>
            <text
              x={plotWidth}
              y={plotHeight + 38}
              textAnchor="end"
              fontSize={11}
              fill="currentColor"
              opacity={0.7}
              fontWeight={500}
            >
              Year
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-fd-muted-foreground">
        {caption}. Doubling period: {doublingMonths} months. Source:{" "}
        <a
          href="https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/"
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          METR
        </a>
        .
      </figcaption>
    </figure>
  );
}

type StatBlockProps = {
  /**
   * Stat groups. Each rendered as a tile with a big number and a label.
   */
  stats: {
    value: string;
    label: string;
    source?: string;
  }[];
};

/**
 * Compact stat grid for the top of a brief. Use for "load-bearing numbers."
 */
export function StatBlock({ stats }: StatBlockProps) {
  return (
    <div className="not-prose my-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-fd-border bg-fd-muted/30 p-4"
        >
          <div className="text-3xl font-bold tracking-tight text-fd-primary">
            {stat.value}
          </div>
          <div className="mt-1 text-sm font-medium text-fd-foreground">
            {stat.label}
          </div>
          {stat.source ? (
            <div className="mt-2 text-xs text-fd-muted-foreground">
              {stat.source}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
