import { notFound } from "next/navigation";
import { SectionPlaceholder } from "@/components/forecast/section-placeholder";
import { FORECAST_SECTIONS } from "@/components/shell/nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return FORECAST_SECTIONS.filter((s) => s.slug).map((s) => ({ section: s.slug }));
}

export default async function SectionPage({ params }: PageProps<"/forecast/[section]">) {
  const { section } = await params;
  const match = FORECAST_SECTIONS.find((s) => s.slug === section);
  if (!match) notFound();
  return <SectionPlaceholder section={{ label: match.label, requires: match.requires }} />;
}
