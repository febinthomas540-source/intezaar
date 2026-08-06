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
import "./india-post-create.css";

const siteUrl = "https://intezaar.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — A letter that travels by train",
    template: "%s | Intezaar",
  },
  description:
    "Write a private digital letter, choose a 3, 5 or 7-day journey, and let it travel through a cinematic Indian post-and-rail route before it can be opened.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Emotional gifting",
  keywords: [
    "scheduled digital letter",
    "Indian mail journey",
    "private online letter",
    "future message",
    "romantic letter experience",
    "railway letter journey",
    "printable letter keepsake",
    "slow digital gifting",
    "nostalgic letter website",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Intezaar",
    title: "Intezaar — A letter that travels by train",
    description:
      "Write something meaningful. Let the sealed letter move through Indian post offices and railway stations, then open it on arrival day.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "A sealed Intezaar letter travelling through a mature Indian mail journey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — A letter that takes the long way",
    description: "A private digital letter delivered through a cinematic Indian mail journey.",
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
  description: "A private digital letter that takes a short cinematic Indian mail journey before it arrives and can be opened.",
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
