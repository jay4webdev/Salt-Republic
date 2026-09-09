import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import CartDrawer, { CartToast } from "@/components/cart-drawer";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const tamil = Noto_Serif_Tamil({
  subsets: ["tamil", "latin"],
  variable: "--font-tamil",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sai Madhu — Organic Shikakai Powder 200 g | சீயக்காய்",
  description:
    "One product, made perfectly. Stone-ground organic shikakai powder in a 200 g jar — ₹300 + ₹50 flat shipping. No SLS, no soap, no silicones. Fresh grind every Monday from Tamil Nadu.",
  keywords: ["shikakai powder", "organic shikakai", "shikakai 200g", "Tamil hair care", "சீயக்காய்", "Sai Madhu"],
  openGraph: {
    title: "Sai Madhu Organic Shikakai Powder — 200 g",
    description: "Long, strong hair the paati way. One powder, stone-ground fresh weekly. ₹300 + ₹50 shipping.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${tamil.variable}`}>
      <body className="bg-cream-50 text-forest-950 antialiased min-h-screen flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
