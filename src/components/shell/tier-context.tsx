"use client";

import { createContext, useContext, useState } from "react";

export const TIERS = [
  { key: "inzicht", label: "Inzicht (gratis)", name: "Inzicht" },
  { key: "vergelijk", label: "Vergelijk", name: "Vergelijk" },
  { key: "regie", label: "Regie", name: "Regie" },
] as const;

export type Tier = (typeof TIERS)[number]["key"];

const rank = (tier: Tier) => TIERS.findIndex((t) => t.key === tier);

export function tierName(tier: Tier) {
  return TIERS[rank(tier)].name;
}

const TierContext = createContext<{ tier: Tier; setTier: (tier: Tier) => void } | null>(null);

/** Demo-abonnement; alleen in de browser, zonder opslag. */
export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier>("inzicht");
  return <TierContext.Provider value={{ tier, setTier }}>{children}</TierContext.Provider>;
}

export function useTier() {
  const ctx = useContext(TierContext);
  if (!ctx) throw new Error("useTier moet binnen TierProvider gebruikt worden");
  const { tier, setTier } = ctx;
  return { tier, setTier, has: (required?: Tier) => !required || rank(tier) >= rank(required) };
}
