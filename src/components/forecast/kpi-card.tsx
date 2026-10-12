import { LevelBadge } from "@/components/forecast/level-badge";

export function KpiCard({ label, value, badge, children }: {
  label: string;
  value: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-sm text-stone-700">{label}</p>
      <p className="mt-2 flex items-center gap-2">
        <span className="text-3xl font-bold tabular-nums text-brand-dark">{value}</span>
        {badge !== undefined && <LevelBadge value={badge} />}
      </p>
      <div className="mt-1.5 text-xs text-stone-600">{children}</div>
    </div>
  );
}
