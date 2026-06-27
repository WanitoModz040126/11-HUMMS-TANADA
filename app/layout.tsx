import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { MusicProvider } from "@/components/MusicProvider";
import MusicToggle from "@/components/MusicToggle";
import AntiCopyGuard from "@/components/AntiCopyGuard";
import ScrollProgress from "@/components/ScrollProgress";
import { HeartsProvider } from "@/components/HeartsProvider";
import members from "@/data/members.json";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${members.section} · S.Y. ${members.schoolYear}`,
  description: `Our class page — officers, students, adviser, and a year of memories from ${members.section}.`,
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="font-body text-parchment antialiased">
        <ScrollProgress />
        <HeartsProvider>
          <MusicProvider>
            {children}
            <MusicToggle />
          </MusicProvider>
        </HeartsProvider>
        <AntiCopyGuard />
      </body>
    </html>
  );
}
