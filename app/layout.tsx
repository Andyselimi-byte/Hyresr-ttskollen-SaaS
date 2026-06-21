import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyresrättskollen — Din hyresrätt. Dina rättigheter. Ditt skydd.",
  description: "Verktyg för svenska hyresgäster: hyresanalys, rättighetsguide, avtalsgranskning och brevgenerator.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
