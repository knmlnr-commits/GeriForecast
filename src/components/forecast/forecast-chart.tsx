import type { WeekPoint } from "@/lib/synthetic-data";

const W = 760;
const H = 280;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };

export function ForecastChart({ data }: { data: WeekPoint[] }) {
  const values = data.flatMap((d) => [d.upper, d.lower, d.capacity, d.actual ?? d.forecast]);
  const min = Math.floor(Math.min(...values) / 10) * 10 - 10;
  const max = Math.ceil(Math.max(...values) / 10) * 10 + 10;

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);

  const firstForecast = data.findIndex((d) => d.actual === null);
  const forecastPts = data.slice(Math.max(0, firstForecast - 1)).map((d, j) => ({ ...d, i: j + Math.max(0, firstForecast - 1) }));

  const band =
    forecastPts.map((d) => `${x(d.i)},${y(d.upper)}`).join(" ") +
    " " +
    [...forecastPts].reverse().map((d) => `${x(d.i)},${y(d.lower)}`).join(" ");
  const actualLine = data
    .map((d, i) => (d.actual === null ? null : `${x(i)},${y(d.actual)}`))
    .filter(Boolean)
    .join(" ");
  const forecastLine = forecastPts.map((d) => `${x(d.i)},${y(d.forecast)}`).join(" ");
  const ticks = Array.from({ length: 5 }, (_, k) => min + ((max - min) / 4) * k);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Verwachte zorgvraag per week">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-slate-200 dark:stroke-slate-700" />
          <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-slate-500 text-[11px]">
            {Math.round(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) =>
        i % 4 === 0 ? (
          <text key={d.week} x={x(i)} y={H - 10} textAnchor="middle" className="fill-slate-500 text-[11px]">
            {d.week}
          </text>
        ) : null,
      )}
      <polygon points={band} className="fill-sky-500/15" />
      <line
        x1={PAD.left}
        x2={W - PAD.right}
        y1={y(data[0].capacity)}
        y2={y(data[0].capacity)}
        className="stroke-rose-500"
        strokeDasharray="6 4"
      />
      <polyline points={actualLine} fill="none" className="stroke-slate-700 dark:stroke-slate-200" strokeWidth={2} />
      <polyline points={forecastLine} fill="none" className="stroke-sky-600" strokeWidth={2} strokeDasharray="4 3" />
      {firstForecast > 0 && (
        <line
          x1={x(firstForecast - 1)}
          x2={x(firstForecast - 1)}
          y1={PAD.top}
          y2={H - PAD.bottom}
          className="stroke-slate-300 dark:stroke-slate-600"
        />
      )}
    </svg>
  );
}
