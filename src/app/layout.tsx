import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./route-selector.css";
import "./mobile.css";
import "./journey-mobile-fix.css";
import "./raahi-site.css";

const siteUrl = "https://intezaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — Memories carried home by Raahi",
    template: "%s | Intezaar",
  },
  description:
    "Create a private memory journey carried by Raahi, a messenger pigeon who delivers one photograph, voice note or keepsake each day before the final sealed letter arrives.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Emotional gifting",
  keywords: [
    "digital memory journey",
    "scheduled online letter",
    "messenger pigeon letter",
    "private photo gift",
    "voice note keepsake",
    "future message",
    "romantic letter experience",
    "memory book PDF",
    "slow digital gifting",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Intezaar",
    title: "Intezaar — Send a memory. Let it find its way home.",
    description:
      "Raahi carries one private memory each day until the final sealed letter reaches home.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Raahi the messenger pigeon carrying an Intezaar memory letter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — Memories carried home by Raahi",
    description: "One memory lands each day. The final letter arrives last.",
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
  themeColor: "#f7edcf",
  colorScheme: "light",
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
  description: "A private memory journey where Raahi delivers one memory at a time before the final letter arrives.",
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
