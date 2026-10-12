// Synthetische dataset voor het prototype: uurlijkse druktecijfers per component en locatie
// van 1 oktober 2025 t/m 30 september 2026. Bevat geen echte cliënt- of organisatiegegevens.
// Alle getallen zijn geïndexeerd: 100 is een gemiddeld uur over de hele periode.

const START = Date.UTC(2025, 9, 1);
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
export const DAYS = 365;
const HOURS = DAYS * 24;
const WEEK = 7 * 24;

export function hourDate(t: number) {
  return new Date(START + t * HOUR_MS);
}

function dayDate(d: number) {
  return new Date(START + d * DAY_MS);
}

// Deterministische pseudo-random generator zodat elke build dezelfde data oplevert.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Relatieve drukte per uur. Avond, nacht en weekend (ANW) zijn het drukst.
const WEEKDAY_PROFILE = [
  1.9, 1.7, 1.4, 1.1, 0.8, 0.6, 0.5, 0.5, 0.4, 0.35, 0.35, 0.35,
  0.35, 0.35, 0.35, 0.4, 0.5, 0.8, 1.2, 1.4, 1.6, 1.7, 1.8, 1.9,
];
const WEEKEND_PROFILE = [
  2.3, 2.1, 1.8, 1.4, 1.0, 0.8, 0.7, 0.8, 1.0, 1.1, 1.2, 1.2,
  1.1, 1.1, 1.1, 1.1, 1.2, 1.4, 1.6, 1.7, 1.9, 2.0, 2.1, 2.2,
];

const WINTER_PEAK = 106; // 15 januari
const FLU_PEAK = 113; // 22 januari

function season(day: number, amplitude: number) {
  const winter = Math.exp(-(((day - WINTER_PEAK) / 30) ** 2));
  const flu = Math.exp(-(((day - FLU_PEAK) / 8) ** 2));
  const year = Math.cos((2 * Math.PI * (day - WINTER_PEAK)) / 365);
  return 1 + amplitude * (0.6 * winter + 0.5 * flu + 0.08 * year);
}

export type Component = {
  key: string;
  label: string;
  weight: number;
  color: string;
  seasonality: number;
  trend: number; // relatieve groei over het jaar
  night: number; // extra drukte tussen 23:00 en 07:00
};

export const COMPONENTS: Component[] = [
  { key: "telefonie", label: "Telefonie", weight: 1, color: "#A8A29E", seasonality: 1, trend: 0.1, night: 1 },
  { key: "digitaal", label: "Digitale intake", weight: 1, color: "#D6D3D1", seasonality: 0.7, trend: 1.1, night: 0.8 },
  { key: "triage", label: "Triage (NTS)", weight: 1.5, color: "#F3AE7E", seasonality: 1, trend: 0.15, night: 1 },
  { key: "consulten", label: "Consulten", weight: 2, color: "#E8732C", seasonality: 1.1, trend: 0.1, night: 0.9 },
  { key: "visites", label: "Visites", weight: 3, color: "#B9531A", seasonality: 1.2, trend: 0, night: 1.15 },
  { key: "opnames", label: "Opnames", weight: 3, color: "#57534E", seasonality: 1.6, trend: -0.05, night: 1.1 },
];

const ORGANISATIONS = [
  "Zorggroep Het Zonnepad",
  "Zorggroep Elzenstroom",
  "Zorggroep Akkerzoom",
  "Stichting Duinroos Zorg",
  "Zorgcombinatie De Linde",
  "Stichting Polderhart",
  "Zorggroep Rivierland-Oost",
  "Stichting Veldhoeve",
];
const TYPES = ["Woonzorgcentrum", "Zorgcentrum", "Verpleeghuis"];
const NAMES = [
  "De Notenboom", "De Dahlia", "De Duizendschoon", "De Acacia", "De Linde", "De Wilgenhof",
  "Het Klaverblad", "De Iepenhof", "De Zonnebloem", "Het Lindehuis", "De Meidoorn", "De Esdoorn",
  "De Vlinderhof", "Het Heidepark", "De Kastanjehof", "De Hazelaar", "De Lavendel", "Het Rozenhof",
  "De Berkenhof", "De Waterlelie", "De Korenbloem", "Het Eikenhout", "De Margriet", "De Vlier",
  "De Populier", "Het Wilgenpark", "De Goudenregen", "De Seringen", "De Magnolia", "De Lijsterbes",
  "De Beukenhof", "Het Akkerhuis", "De Klimop", "De Hortensia", "De Tulp", "De Jasmijn",
  "De Platanen", "De Dennenhof", "De Anemoon", "De Weidebloem",
];

export type Location = { name: string; organisation: string; value: number };

function mean(xs: ArrayLike<number>, from = 0, to = xs.length) {
  let sum = 0;
  for (let i = from; i < to; i++) sum += xs[i];
  return sum / (to - from);
}

function normalise(xs: Float64Array) {
  const m = mean(xs);
  for (let i = 0; i < xs.length; i++) xs[i] = (xs[i] / m) * 100;
  return xs;
}

function buildDataset() {
  const rand = mulberry32(20251001);
  const weekdays = Array.from({ length: DAYS }, (_, d) => dayDate(d).getUTCDay());
  const dayNoise = Array.from({ length: DAYS }, () => 1 + 0.25 * (rand() - 0.5));

  const components = COMPONENTS.map((c) => {
    const xs = new Float64Array(HOURS);
    for (let t = 0; t < HOURS; t++) {
      const d = Math.floor(t / 24);
      const h = t % 24;
      const weekend = weekdays[d] === 0 || weekdays[d] === 6;
      const nightFactor = h >= 23 || h < 7 ? c.night : 1;
      xs[t] =
        (weekend ? WEEKEND_PROFILE : WEEKDAY_PROFILE)[h] *
        nightFactor *
        season(d, c.seasonality) *
        (1 + (c.trend * d) / DAYS) *
        dayNoise[d] *
        (1 + 0.3 * (rand() - 0.5));
    }
    return normalise(xs);
  });

  const totalWeight = COMPONENTS.reduce((s, c) => s + c.weight, 0);
  const composite = new Float64Array(HOURS);
  for (let t = 0; t < HOURS; t++) {
    let sum = 0;
    COMPONENTS.forEach((c, i) => (sum += c.weight * components[i][t]));
    composite[t] = sum / totalWeight;
  }
  normalise(composite);

  // Locaties volgen het totaalbeeld met een eigen seizoensverloop, uitbraken en ruis.
  const locations: Location[] = NAMES.map((name, i) => {
    const phase = rand() * 2 * Math.PI;
    const amplitude = 0.05 + rand() * 0.1;
    const outbreakDay = Math.floor(rand() * DAYS);
    const outbreakSize = 0.2 + rand() * 0.5;
    const xs = new Float64Array(HOURS);
    for (let t = 0; t < HOURS; t++) {
      const d = Math.floor(t / 24);
      xs[t] =
        composite[t] *
        (1 + amplitude * Math.sin((2 * Math.PI * d) / DAYS + phase)) *
        (1 + outbreakSize * Math.exp(-(((d - outbreakDay) / 6) ** 2))) *
        (1 + 0.4 * (rand() - 0.5));
    }
    return {
      name: `${TYPES[i % TYPES.length]} ${name}`,
      organisation: ORGANISATIONS[(i * 5 + 3) % ORGANISATIONS.length],
      value: Math.round((100 * mean(xs, HOURS - WEEK)) / mean(xs)),
    };
  });

  return { composite, components, locations };
}

type ShiftWindow = { label: string; start: Date; value: number };

function shiftWindows(composite: Float64Array, fromDay: number): ShiftWindow[] {
  const windows: ShiftWindow[] = [];
  for (let d = fromDay; d < DAYS; d++) {
    const wd = dayDate(d).getUTCDay();
    const weekendDay = wd === 0 || wd === 6;
    const weekendNight = wd === 5 || wd === 6;
    const defs = [
      { label: weekendDay ? "Weekenddag" : "Dagdienst", from: 8, to: 17 },
      { label: weekendDay ? "Weekendavond" : "Avonddienst", from: 17, to: 23 },
      { label: weekendNight ? "Weekendnacht" : "Nachtdienst", from: 23, to: 32 },
    ];
    for (const w of defs) {
      const start = d * 24 + w.from;
      const end = d * 24 + w.to;
      if (end > HOURS) continue; // dienst loopt door na het einde van de dataset
      windows.push({ label: w.label, start: hourDate(start), value: mean(composite, start, end) });
    }
  }
  return windows;
}

export function computeOverview() {
  const { composite, components, locations } = buildDataset();

  const daily = Array.from({ length: DAYS }, (_, d) => mean(composite, d * 24, d * 24 + 24));
  const days = daily.map((value, d) => {
    const from = Math.max(0, d - 6);
    return { date: dayDate(d), value, average: mean(daily, from, d + 1) };
  });

  const last7 = mean(composite, HOURS - WEEK);
  const previous7 = mean(composite, HOURS - 2 * WEEK, HOURS - WEEK);

  let peakHour = HOURS - WEEK;
  for (let t = HOURS - WEEK; t < HOURS; t++) if (composite[t] > composite[peakHour]) peakHour = t;

  const busiestWindow = shiftWindows(composite, DAYS - 7).reduce((a, b) => (b.value > a.value ? b : a));

  // Gemiddelde per weekdag (ma t/m zo) en uur over de hele periode.
  const heatmap = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => ({ sum: 0, n: 0 })));
  for (let t = 0; t < HOURS; t++) {
    const row = (hourDate(t).getUTCDay() + 6) % 7;
    const cell = heatmap[row][t % 24];
    cell.sum += composite[t];
    cell.n++;
  }

  return {
    endDate: dayDate(DAYS - 1),
    kpis: {
      last7: Math.round(last7),
      delta: Math.round(last7) - Math.round(previous7),
      busiestWindow: { ...busiestWindow, value: Math.round(busiestWindow.value) },
      peak: { date: hourDate(peakHour), value: Math.round(composite[peakHour]) },
      locationsAbove120: locations.filter((l) => l.value > 120).length,
      locationCount: locations.length,
    },
    days,
    components: COMPONENTS.map((c, i) => ({ ...c, value: Math.round(mean(components[i], HOURS - WEEK)) })),
    heatmap: heatmap.map((row) => row.map((c) => c.sum / c.n)),
    locations: [...locations].sort((a, b) => b.value - a.value),
  };
}

export type Overview = ReturnType<typeof computeOverview>;
