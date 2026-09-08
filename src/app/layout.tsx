import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/Toast";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "TipsHub — Betting Tips & Codes",
    template: "%s — TipsHub",
  },
  description: "Private betting community — official tips, booking codes, and results.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[var(--th-bg)] text-[var(--th-text)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <footer className="border-t border-[var(--th-border)] py-8 text-center">
          <p className="text-[12px] leading-none tracking-[0.04em] text-[var(--th-sub)]">TipsHub — Private community. Not a bookmaker.</p>
        </footer>
      </body>
    </html>
  );
}
