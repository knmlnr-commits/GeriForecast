import type { Overview } from "@/lib/geriforecast/data";
import { formatDayShort } from "@/lib/geriforecast/format";

const W = 720;
const H = 260;
const PAD = { top: 12, right: 28, bottom: 28, left: 40 };

export function DailyChart({ days }: { days: Overview["days"] }) {
  const max = Math.max(...days.map((d) => d.value));
  const step = Math.ceil(max / 4 / 10) * 10;
  const top = step * 4;

  const x = (i: number) => PAD.left + (i / (days.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / top) * (H - PAD.top - PAD.bottom);
  const slot = (W - PAD.left - PAD.right) / days.length;

  const valueLine = days.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const averageLine = days.map((d, i) => `${x(i).toFixed(1)},${y(d.average).toFixed(1)}`).join(" ");
  const area = `M${x(0)},${y(0)} L${valueLine.replaceAll(" ", " L")} L${x(days.length - 1)},${y(0)} Z`;

  // Labels gelijkmatig verdeeld, eindigend op de laatste dag.
  const labels = Array.from({ length: 9 }, (_, k) => Math.round(days.length - 1 - (8 - k) * ((days.length - 30) / 8)));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Druktegetal per dag over 12 maanden">
      <defs>
        <linearGradient id="daily-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e8732c" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#e8732c" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(k * step)} y2={y(k * step)} stroke="#ece9e6" />
          <text x={PAD.left - 8} y={y(k * step) + 4} textAnchor="end" className="fill-stone-500 text-[11px]">
            {k * step}
          </text>
        </g>
      ))}
      {labels.map((i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-stone-500 text-[11px]">
          {formatDayShort(days[i].date)}
        </text>
      ))}
      <path d={area} fill="url(#daily-area)" />
      <line x1={PAD.left} x2={W - PAD.right} y1={y(100)} y2={y(100)} stroke="#8a8580" strokeDasharray="4 3" />
      <polyline points={valueLine} fill="none" stroke="#ef9a62" strokeWidth={1} strokeLinejoin="round" />
      <polyline points={averageLine} fill="none" stroke="#b9531a" strokeWidth={2} strokeLinejoin="round" />
      {days.map((d, i) => (
        <rect key={i} x={x(i) - slot / 2} y={PAD.top} width={slot} height={H - PAD.top - PAD.bottom} fill="transparent">
          <title>{`${formatDayShort(d.date)}: ${Math.round(d.value)} (7-daags gemiddelde ${Math.round(d.average)})`}</title>
        </rect>
      ))}
    </svg>
  );
}
