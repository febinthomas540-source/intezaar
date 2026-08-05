import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./route-selector.css";
import "./mobile.css";
import "./journey-mobile-fix.css";
import "./raahi-site.css";
import "./cinematic-site.css";
import "./clarity-home.css";

const siteUrl = "https://intezaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — One memory arrives each day",
    template: "%s | Intezaar",
  },
  description:
    "Create a private journey of photographs, notes, voice messages and a final sealed letter. One memory unlocks each day, then the complete story becomes an A4 keepsake.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Emotional gifting",
  keywords: [
    "digital memory journey",
    "scheduled online letter",
    "private photo gift",
    "voice note keepsake",
    "future message",
    "romantic letter experience",
    "memory book PDF",
    "slow digital gifting",
    "nostalgic letter website",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Intezaar",
    title: "Intezaar — Some memories should not arrive instantly",
    description:
      "Upload memories and a final letter. Your recipient receives one memory each day before the full letter arrives.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Intezaar rainy-night private memory journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — One memory arrives each day",
    description: "A private daily memory journey ending in one sealed letter and an A4 keepsake.",
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
  themeColor: "#0f0d0b",
  colorScheme: "dark",
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
  description: "A private journey where one memory opens each day before the final letter and A4 keepsake arrive.",
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
