import type { Metadata } from "next";
import "./globals.css";
import "./postal-theme.css";

export const metadata: Metadata = {
  title: "Intezaar — A letter carried by post and rail",
  description:
    "A nostalgic Indian postal journey where memories travel by post box, railway mail and monsoon routes before the letter arrives.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
