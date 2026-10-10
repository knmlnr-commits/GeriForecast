import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeriForecast (prototype)",
  description: "Klikbaar prototype van GeriForecast; synthetische data, niet voor productie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
