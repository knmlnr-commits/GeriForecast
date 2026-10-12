import { levelOf, type Level } from "@/lib/geriforecast/levels";

const STYLES: Record<Level, string> = {
  Rustig: "bg-stone-100 text-stone-600",
  Normaal: "bg-stone-200 text-stone-700",
  Druk: "bg-brand-soft text-brand-dark",
  "Zeer druk": "bg-brand text-white",
};

export function LevelBadge({ value }: { value: number }) {
  const level = levelOf(value);
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STYLES[level]}`}>{level}</span>;
}
