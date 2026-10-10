// Synthetische data voor het prototype. Bevat geen echte cliënt- of organisatiegegevens.

export type Region = "Noord" | "Midden" | "Zuid";

export const REGIONS: Region[] = ["Noord", "Midden", "Zuid"];

export type WeekPoint = {
  week: string;
  actual: number | null;
  forecast: number;
  lower: number;
  upper: number;
  capacity: number;
};

// Deterministische pseudo-random generator zodat server en client dezelfde data tonen.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REGION_PARAMS: Record<Region, { base: number; trend: number; capacity: number; seed: number }> = {
  Noord: { base: 118, trend: 0.9, capacity: 140, seed: 11 },
  Midden: { base: 162, trend: 1.4, capacity: 185, seed: 23 },
  Zuid: { base: 97, trend: 0.6, capacity: 120, seed: 37 },
};

const HISTORY_WEEKS = 16;
const FORECAST_WEEKS = 12;

export function getSeries(region: Region): WeekPoint[] {
  const p = REGION_PARAMS[region];
  const rand = mulberry32(p.seed);
  const points: WeekPoint[] = [];

  for (let i = 0; i < HISTORY_WEEKS + FORECAST_WEEKS; i++) {
    const seasonal = 8 * Math.sin((i / 52) * 2 * Math.PI + 1.2);
    const expected = p.base + p.trend * i + seasonal;
    const isHistory = i < HISTORY_WEEKS;
    const horizon = Math.max(0, i - HISTORY_WEEKS + 1);
    const spread = isHistory ? 3 : 4 + horizon * 1.2;
    points.push({
      week: `wk ${((i + 30) % 52) + 1}`,
      actual: isHistory ? Math.round(expected + (rand() - 0.5) * 14) : null,
      forecast: Math.round(expected),
      lower: Math.round(expected - spread),
      upper: Math.round(expected + spread),
      capacity: p.capacity,
    });
  }
  return points;
}
