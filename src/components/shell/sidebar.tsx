"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { FORECAST_SECTIONS, MODULES } from "@/components/shell/nav";
import { tierName, useTier } from "@/components/shell/tier-context";

export function Sidebar() {
  const pathname = usePathname();
  const { has } = useTier();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-stone-200 bg-stone-50">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">G</span>
        <span className="text-lg font-bold text-stone-700">GeriForce</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
        <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-stone-600">Modules</p>
        <ul>
          {MODULES.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2.5 px-2 py-1.5 text-stone-400" title="Andere module; niet in dit prototype">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-center gap-2 px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-brand-dark">
          GeriForecast
          <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-brand-dark">
            nieuw
          </span>
        </p>
        <ul className="space-y-0.5">
          {FORECAST_SECTIONS.map(({ slug, label, icon: Icon, requires }) => {
            const href = slug ? `/forecast/${slug}` : "/forecast";
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg border px-2 py-1.5 ${
                    active
                      ? "border-stone-200 bg-white font-semibold text-brand-dark shadow-sm"
                      : "border-transparent text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="flex-1">{label}</span>
                  {requires && !has(requires) && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-brand-dark">
                      <Lock className="h-3 w-3" />
                      {tierName(requires)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="border-t border-stone-200 px-3 py-3 text-xs text-stone-600">
        Prototype; synthetische data. Niet voor productie.
      </p>
    </aside>
  );
}
