import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { BusiestLocations } from "@/components/forecast/busiest-locations";
import { Card } from "@/components/forecast/card";
import { ComponentBars } from "@/components/forecast/component-bars";
import { DailyChart } from "@/components/forecast/daily-chart";
import { Heatmap } from "@/components/forecast/heatmap";
import { KpiCard } from "@/components/forecast/kpi-card";
import { computeOverview } from "@/lib/geriforecast/data";
import { formatDateLong, formatDayShort, formatHour } from "@/lib/geriforecast/format";

export function OverviewView() {
  const { endDate, kpis, days, components, heatmap, locations } = computeOverview();
  const DeltaIcon = kpis.delta < 0 ? ArrowDownRight : kpis.delta > 0 ? ArrowUpRight : ArrowRight;

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Overzicht</h1>
        <p className="mt-1 max-w-3xl text-sm text-stone-700">
          Druktegetal voor alle regio&apos;s, afgelopen 7 dagen tot en met {formatDateLong(endDate)} (einde van de
          synthetische dataset). 100 is een gemiddeld uur; hoger is drukker.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Druktegetal afgelopen 7 dagen" value={kpis.last7} badge={kpis.last7}>
          <span className="flex items-center gap-1">
            <DeltaIcon className="h-3.5 w-3.5" />
            {kpis.delta > 0 ? "+" : ""}
            {kpis.delta} t.o.v. vorige periode
          </span>
        </KpiCard>
        <KpiCard label="Drukste dienstvenster" value={kpis.busiestWindow.value} badge={kpis.busiestWindow.value}>
          {formatDayShort(kpis.busiestWindow.start)}, {kpis.busiestWindow.label}
        </KpiCard>
        <KpiCard label="Piekuur afgelopen 7 dagen" value={kpis.peak.value} badge={kpis.peak.value}>
          {formatHour(kpis.peak.date)}
        </KpiCard>
        <KpiCard label="Locaties boven 120" value={`${kpis.locationsAbove120} van ${kpis.locationCount}`}>
          gemiddeld afgelopen 7 dagen
        </KpiCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
        <Card
          title="Druktegetal per dag, 12 maanden"
          subtitle="Dagwaarde met voortschrijdend gemiddelde over 7 dagen. Zichtbaar: winterpiek en griepgolf in januari."
        >
          <div className="px-4 pb-4">
            <DailyChart days={days} />
          </div>
        </Card>
        <Card title="Opbouw per component" subtitle="Index per component afgelopen 7 dagen; tussen haakjes het gewicht.">
          <div className="px-4 pb-4">
            <ComponentBars components={components} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_372px]">
        <Card
          title="Wanneer is het druk?"
          subtitle="Gemiddeld druktegetal per uur en weekdag over 12 maanden. Nachten en weekenden springen eruit."
        >
          <Heatmap values={heatmap} />
        </Card>
        <Card title="Drukste locaties" subtitle="Afgelopen 7 dagen, ten opzichte van het eigen gemiddelde.">
          <BusiestLocations locations={locations.slice(0, 5)} />
        </Card>
      </section>
    </div>
  );
}
