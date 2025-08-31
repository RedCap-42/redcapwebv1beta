import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press",
  weight: "400",
  subsets: ["latin"],
});

const daydream = localFont({
  src: "../components/feedback/fonttitle/Daydream DEMO.otf",
  variable: "--font-daydream",
  display: "swap",
});

const textFont = localFont({
  src: "../components/feedback/fonttext/upheavtt.ttf",
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CasquetteRouge",
  description: "Site CasquetteRouge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} ${daydream.variable} ${textFont.variable} text-font antialiased bg-white text-neutral-900`}>
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
