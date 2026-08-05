import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./route-selector.css";
import "./mobile.css";
import "./journey-mobile-fix.css";
import "./raahi-site.css";
import "./cinematic-site.css";

const siteUrl = "https://intezaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — Memories that take time to arrive",
    template: "%s | Intezaar",
  },
  description:
    "Create a private journey of photographs, voice notes, keepsakes and a final sealed letter. One memory arrives each day, carried through a quiet nostalgic world.",
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
      "One photograph, voice or keepsake arrives each day before the final sealed letter is opened.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Intezaar nostalgic memory and letter experience" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — Memories that take time to arrive",
    description: "A quiet private journey ending in one sealed letter.",
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
  themeColor: "#1d1814",
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
  description: "A private memory journey where one meaningful fragment arrives at a time before the final letter opens.",
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
