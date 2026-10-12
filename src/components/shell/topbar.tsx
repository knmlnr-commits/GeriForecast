"use client";

import { Bell, ChevronRight, Lock } from "lucide-react";
import { TIERS, useTier, type Tier } from "@/components/shell/tier-context";

export function Topbar() {
  const { tier, setTier, has } = useTier();

  return (
    <header className="flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-200 bg-white px-4 py-2 sm:px-6">
      <nav aria-label="Kruimelpad" className="flex items-center gap-1.5 text-sm text-stone-700">
        <span>GeriForce</span>
        <ChevronRight className="h-4 w-4 text-stone-400" />
        <span>GeriForecast</span>
      </nav>
      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-dark">
        Prototype; synthetische data
      </span>

      <div className="ml-auto flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <span className="hidden sm:inline">Demo: abonnement</span>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier)}
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-normal text-stone-800"
          >
            {TIERS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <span className="relative text-stone-500" title={has("regie") ? "Meldingen" : "Meldingen vanaf abonnement Regie"}>
          <Bell className="h-5 w-5" strokeWidth={1.5} />
          {!has("regie") && <Lock className="absolute -bottom-1 -right-1.5 h-3 w-3 text-brand" />}
        </span>
        <span className="flex items-center gap-2 text-sm text-stone-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
            DG
          </span>
          <span className="hidden sm:inline">Demo-gebruiker</span>
        </span>
      </div>
    </header>
  );
}
