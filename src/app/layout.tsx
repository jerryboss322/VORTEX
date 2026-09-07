import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
        <footer className="border-t border-[#262626] py-6 text-center text-xs text-zinc-500">
          TipsHub — Private community. Not a bookmaker.
        </footer>
      </body>
    </html>
  );
}
