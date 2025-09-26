import type { Metadata } from "next";
import { Inter, Space_Grotesk, PT_Mono } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const mono = PT_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "show-off.art",
  description: "created by artist, for artist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${grotesk.variable} ${mono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
