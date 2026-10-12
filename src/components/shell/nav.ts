import {
  Activity, Building2, CalendarClock, ChartColumn, ChartLine, CreditCard, Gauge,
  GitCompareArrows, LayoutGrid, MapPin, Bell, SlidersHorizontal, type LucideIcon,
} from "lucide-react";
import type { Tier } from "@/components/shell/tier-context";

/** Overige GeriForce-modules; niet onderdeel van dit prototype. */
export const MODULES: { label: string; icon: LucideIcon }[] = [
  { label: "Consultdashboard", icon: LayoutGrid },
  { label: "ANW-planner", icon: CalendarClock },
  { label: "Locaties", icon: MapPin },
  { label: "Reporting", icon: ChartColumn },
  { label: "Metrics", icon: Activity },
  { label: "Accountsdashboard", icon: Building2 },
];

export type ForecastSection = { slug: string; label: string; icon: LucideIcon; requires?: Tier };

export const FORECAST_SECTIONS: ForecastSection[] = [
  { slug: "", label: "Overzicht", icon: Gauge },
  { slug: "druktegetal", label: "Druktegetal", icon: ChartLine },
  { slug: "vergelijk", label: "Vergelijk", icon: GitCompareArrows, requires: "vergelijk" },
  { slug: "alarmen", label: "Alarmen", icon: Bell, requires: "regie" },
  { slug: "gewichten", label: "Gewichten", icon: SlidersHorizontal, requires: "regie" },
  { slug: "abonnement", label: "Abonnement en ROI", icon: CreditCard },
];
