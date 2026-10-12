"use client";

import { Lock } from "lucide-react";
import type { ForecastSection } from "@/components/shell/nav";
import { tierName, useTier } from "@/components/shell/tier-context";

export function SectionPlaceholder({ section }: { section: Pick<ForecastSection, "label" | "requires"> }) {
  const { has, setTier } = useTier();
  const locked = section.requires && !has(section.requires);

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <h1 className="text-2xl font-bold text-stone-800">{section.label}</h1>
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-600">
        {locked && section.requires ? (
          <>
            <Lock className="mx-auto mb-2 h-5 w-5 text-brand" />
            <p>
              {section.label} is beschikbaar vanaf het abonnement <strong>{tierName(section.requires)}</strong>.
            </p>
            <button
              onClick={() => setTier(section.requires!)}
              className="mt-4 rounded-md bg-brand px-3 py-1.5 font-semibold text-white hover:bg-brand-dark"
            >
              Demo: schakel naar {tierName(section.requires)}
            </button>
          </>
        ) : (
          <p>Dit scherm is nog niet uitgewerkt in het prototype.</p>
        )}
      </div>
    </div>
  );
}
