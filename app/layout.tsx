import type { Metadata } from "next";
import "./globals.css";
import { panchang, geistSans, geistMono, chewy } from "./fonts";

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
