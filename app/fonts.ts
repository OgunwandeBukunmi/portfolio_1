import localFont from "next/font/local";
import { Geist, Geist_Mono, Chewy } from "next/font/google";

export const chewy = Chewy({
  weight: "400",
  variable: "--font-chewy",
  display: "swap",
});

export const panchang = localFont({
  src: "/fonts/Panchang-Variable.woff2",
  variable: "--font-panchang",
  display: "swap",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});