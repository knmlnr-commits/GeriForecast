import { Sidebar } from "@/components/shell/sidebar";
import { TierProvider } from "@/components/shell/tier-context";
import { Topbar } from "@/components/shell/topbar";

export default function ForecastLayout({ children }: LayoutProps<"/forecast">) {
  return (
    <TierProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </TierProvider>
  );
}
