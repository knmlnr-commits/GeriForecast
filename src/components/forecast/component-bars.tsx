import type { Overview } from "@/lib/geriforecast/data";
import { formatWeight } from "@/lib/geriforecast/format";

const W = 340;
const ROW = 34;
const PAD = { top: 8, right: 12, bottom: 28, left: 150 };

export function ComponentBars({ components }: { components: Overview["components"] }) {
  const max = Math.max(160, Math.ceil(Math.max(...components.map((c) => c.value)) / 40) * 40);
  const H = PAD.top + components.length * ROW + PAD.bottom;
  const x = (v: number) => PAD.left + (v / max) * (W - PAD.left - PAD.right);
  const ticks = Array.from({ length: max / 40 + 1 }, (_, k) => k * 40);
  const bottom = H - PAD.bottom;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Index per component afgelopen 7 dagen">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={PAD.top} y2={bottom} stroke="#ece9e6" />
          <text x={x(t)} y={H - 8} textAnchor="middle" className="fill-stone-500 text-[11px]">
            {t}
          </text>
        </g>
      ))}
      {components.map((c, i) => {
        const yTop = PAD.top + i * ROW + 4;
        return (
          <g key={c.key}>
            <text x={PAD.left - 8} y={yTop + 17} textAnchor="end" className="fill-stone-600 text-[11px]">
              {`${c.label} (x${formatWeight(c.weight)})`}
            </text>
            <rect x={x(0)} y={yTop} width={x(c.value) - x(0)} height={ROW - 8} fill={c.color}>
              <title>{`${c.label}: ${c.value} (gewicht ${formatWeight(c.weight)})`}</title>
            </rect>
          </g>
        );
      })}
      <line x1={x(100)} x2={x(100)} y1={PAD.top} y2={bottom} stroke="#8a8580" strokeDasharray="3 3" />
    </svg>
  );
}
