import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./route-selector.css";
import "./mobile.css";

const siteUrl = "https://intezaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — A nostalgic Indian letter journey",
    template: "%s | Intezaar",
  },
  description:
    "Create a private letter that travels through nostalgic Indian post boxes, railway mail routes, cities and monsoon memories before it arrives.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Emotional gifting",
  keywords: [
    "nostalgic letter website",
    "Indian postal journey",
    "digital letter delivery",
    "scheduled online letter",
    "Indian railway nostalgia",
    "memory gift",
    "future message",
    "romantic letter experience",
    "India Post inspired",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Intezaar",
    title: "Intezaar — A letter carried by post and rail",
    description:
      "Drop a memory into a red Indian post box and let it travel by railway mail before the final letter arrives.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Intezaar nostalgic Indian postal and railway letter journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — A letter carried by post and rail",
    description: "A nostalgic Indian postal journey where memories travel before the letter arrives.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#8f2f20",
  colorScheme: "light dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Intezaar",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Intezaar",
  url: siteUrl,
  description: "A nostalgic Indian postal journey where private letters travel through cities and railway routes before they arrive.",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: "Intezaar" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </body>
    </html>
  );
}
