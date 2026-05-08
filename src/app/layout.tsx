import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STOIC — AI-Powered Sales Command Center",
  description: "12 autonomous AI agents. One command center. Close deals across every timezone while your competitors sleep.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), 'Inter', -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
