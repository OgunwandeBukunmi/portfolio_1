import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { panchang, geistSans, geistMono } from "./fonts";

export const metadata: Metadata = {
  title: "Wayne",
  description: "Wayne's World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${panchang.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
