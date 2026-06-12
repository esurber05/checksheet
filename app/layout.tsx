import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import IconRail from "@/components/layout/IconRail.tsx";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Checksheet",
  description: "Degree audit and graduation planning for Virginia Tech students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          <IconRail />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </body>
    </html>
  );
}
