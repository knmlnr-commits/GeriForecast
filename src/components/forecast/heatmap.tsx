const DAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const STOPS = ["#fcf4ee", "#f8dcc6", "#f1aa78", "#e6783a", "#b9531a"];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function colorAt(t: number) {
  const pos = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1);
  const i = Math.min(Math.floor(pos), STOPS.length - 2);
  const a = hexToRgb(STOPS[i]);
  const b = hexToRgb(STOPS[i + 1]);
  const f = pos - i;
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
}

export function Heatmap({ values }: { values: number[][] }) {
  const flat = values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  return (
    <div className="overflow-x-auto px-4 pb-4">
      <div className="grid min-w-[560px] grid-cols-[28px_repeat(24,minmax(0,1fr))] gap-[3px] text-[10px] text-stone-500">
        <span />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className="pb-1">
            {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
          </span>
        ))}
        {values.map((row, d) => (
          <div key={d} className="contents">
            <span className="self-center font-semibold">{DAYS[d]}</span>
            {row.map((v, h) => (
              <span
                key={h}
                className="h-6 rounded-[3px]"
                style={{ background: colorAt((v - min) / (max - min)) }}
                title={`${DAYS[d]} ${String(h).padStart(2, "0")}:00: ${Math.round(v)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
        Rustig
        <span className="h-2 w-40 rounded-full" style={{ background: `linear-gradient(to right, ${STOPS.join(",")})` }} />
        Zeer druk
      </div>
    </div>
  );
}
