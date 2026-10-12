import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato" });

export const metadata: Metadata = {
  title: "GeriForecast (prototype)",
  description: "Klikbaar prototype van GeriForecast; synthetische data, niet voor productie.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`h-full antialiased ${lato.variable}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
