import type { Metadata } from "next";
import { Inter, Chivo_Mono, PT_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const titles = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-titles",
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
      <body className={`${sans.variable} ${titles.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
