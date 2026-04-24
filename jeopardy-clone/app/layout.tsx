import type { Metadata } from "next";
import { Anton, Oswald } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const oswald = Oswald({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Jeopardy!",
  description:
    "A Jeopardy clone built with Next.js, TypeScript, and TailwindCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${oswald.variable} bg-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
