import type { Metadata, Viewport } from "next";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./mobile.css";
import "./cinematic-site.css";
import "./india-post-create.css";
import "./letter-studio.css";
import "./letter-studio-formats.css";
import "./creation-flow-v2.css";

const siteUrl = "https://www.intezaar.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — Write it. Seal it. Post it.",
    template: "%s | Intezaar",
  },
  description:
    "Write a private digital letter, choose when it can be opened, seal it and post it through the Intezaar post box.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Private digital letters",
  keywords: [
    "scheduled digital letter",
    "private online letter",
    "future message",
    "romantic letter experience",
    "digital post box",
    "birthday letter",
    "anniversary letter",
    "private delayed message",
    "nostalgic letter website",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Intezaar",
    title: "Intezaar — Write it. Seal it. Post it.",
    description:
      "Create a private digital letter, choose the opening moment and post it through the Intezaar letter box.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "A sealed private letter beside the red Intezaar digital post box" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — Write it. Seal it. Post it.",
    description: "A private digital letter posted now and opened at the chosen moment.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#271711",
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
  description: "A private digital letter you write, seal, post and open later.",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: "Intezaar" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        {children}
        <MetaPixel />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </body>
    </html>
  );
}
