"use client";

import { useMemo, useState } from "react";
import { ForecastChart } from "@/components/forecast/forecast-chart";
import { getSeries, REGIONS, type Region } from "@/lib/synthetic-data";

export function OverviewView() {
  const [region, setRegion] = useState<Region>("Midden");
  const data = useMemo(() => getSeries(region), [region]);

  const lastActual = [...data].reverse().find((d) => d.actual !== null)!;
  const forecast = data.filter((d) => d.actual === null);
  const peak = forecast.reduce((a, b) => (b.upper > a.upper ? b : a));
  const weeksOverCapacity = forecast.filter((d) => d.upper > d.capacity).length;
  const occupancy = Math.round((lastActual.actual! / lastActual.capacity) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Prototype · synthetische data
          </p>
          <h1 className="text-2xl font-semibold">GeriForecast</h1>
          <p className="text-sm text-slate-500">Verwachte zorgvraag (aantal cliënten) per week, komende 12 weken.</p>
        </div>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-1 text-sm">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`rounded-md px-3 py-1.5 ${
                r === region ? "bg-sky-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Huidige bezetting" value={`${occupancy}%`} sub={`${lastActual.actual} van ${lastActual.capacity} plekken`} />
        <Stat label="Verwachte piek" value={`${peak.forecast}`} sub={`${peak.week}, bovengrens ${peak.upper}`} />
        <Stat
          label="Weken boven capaciteit"
          value={`${weeksOverCapacity}`}
          sub="bovengrens > capaciteit"
          tone={weeksOverCapacity > 0 ? "warn" : "ok"}
        />
      </section>

      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <div className="mb-2 flex flex-wrap gap-4 text-xs text-slate-500">
          <Legend className="bg-slate-700 dark:bg-slate-200" label="Gerealiseerd" />
          <Legend className="bg-sky-600" label="Prognose" />
          <Legend className="bg-sky-500/30" label="Onzekerheidsband" />
          <Legend className="bg-rose-500" label="Capaciteit" />
        </div>
        <ForecastChart data={data} />
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Week</th>
              <th className="px-4 py-2 font-medium text-right">Prognose</th>
              <th className="px-4 py-2 font-medium text-right">Bandbreedte</th>
              <th className="px-4 py-2 font-medium text-right">Capaciteit</th>
              <th className="px-4 py-2 font-medium">Signaal</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((d) => (
              <tr key={d.week} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-2">{d.week}</td>
                <td className="px-4 py-2 text-right tabular-nums">{d.forecast}</td>
                <td className="px-4 py-2 text-right tabular-nums text-slate-500">
                  {d.lower}–{d.upper}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{d.capacity}</td>
                <td className="px-4 py-2">
                  {d.forecast > d.capacity ? (
                    <span className="text-rose-600">Tekort verwacht</span>
                  ) : d.upper > d.capacity ? (
                    <span className="text-amber-600">Risico</span>
                  ) : (
                    <span className="text-emerald-600">Voldoende</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "ok" | "warn" }) {
  const color = tone === "warn" ? "text-amber-600" : tone === "ok" ? "text-emerald-600" : "";
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-sm ${className}`} />
      {label}
    </span>
  );
}
