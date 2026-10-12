import { LevelBadge } from "@/components/forecast/level-badge";
import type { Location } from "@/lib/geriforecast/data";

export function BusiestLocations({ locations }: { locations: Location[] }) {
  return (
    <div>
      <div className="flex justify-between border-y border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-stone-600">
        <span>Locatie</span>
        <span>Getal</span>
      </div>
      <ul>
        {locations.map((l) => (
          <li key={l.name} className="flex items-start justify-between gap-3 border-b border-stone-100 px-4 py-2.5 last:border-b-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">{l.name}</p>
              <p className="truncate text-xs text-stone-600">{l.organisation}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums text-stone-800">{l.value}</span>
              <LevelBadge value={l.value} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
