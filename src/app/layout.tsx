import type { Metadata } from "next";
import { Playfair_Display, Poppins, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "To The Most Beautiful Sister ❤️ | Cinematic Birthday scrapbooking",
  description: "An elegant interactive luxury digital scrapbook & cinematic experience celebrating the most beautiful sister.",
  openGraph: {
    title: "To The Most Beautiful Sister ❤️",
    description: "An elegant interactive luxury digital scrapbook & cinematic experience celebrating the most beautiful sister.",
    type: "website",
  }
};

import { AudioProvider } from "@/context/AudioContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAF5F5] text-slate-800 font-sans selection:bg-[#B76E79]/20 selection:text-[#B76E79]">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}

