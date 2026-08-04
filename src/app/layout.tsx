import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intezaar — Send a letter that travels",
  description:
    "A cinematic emotional-delivery platform where messages travel before they arrive.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
