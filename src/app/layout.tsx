import type { Metadata, Viewport } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import { FirstPartyAnalytics } from "@/components/first-party-analytics";
import { InstalledAppShell } from "@/components/installed-app-shell";
import { MetaPixel } from "@/components/meta-pixel";
import { RecipientLinkRecovery } from "@/components/recipient-link-recovery";
import "./globals.css";
import "./postal-theme.css";
import "./postal-interactions.css";
import "./mobile.css";
import "./cinematic-site.css";
import "./india-post-create.css";
import "./letter-studio.css";
import "./letter-studio-formats.css";
import "./creation-flow-v2.css";
import "./installed-app-shell.css";
import "./typography-refresh.css";
import "./design-refinement.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

const siteUrl = "https://www.intezaar.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Intezaar — Letters That Are Meant to Wait",
    template: "%s | Intezaar",
  },
  description:
    "Write a private digital letter for someone you love or your future self, choose when it can be opened, seal it and let the moment arrive later.",
  applicationName: "Intezaar",
  authors: [{ name: "Intezaar" }],
  creator: "Intezaar",
  publisher: "Intezaar",
  category: "Private digital letters",
  appleWebApp: {
    capable: true,
    title: "Intezaar",
    statusBarStyle: "black-translucent",
  },
  keywords: [
    "scheduled digital letter",
    "private online letter",
    "write a letter to my future self",
    "future self letter",
    "open when letters",
    "private unsent letter",
    "write now send later",
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
    title: "Intezaar — Letters That Are Meant to Wait",
    description:
      "Write a private letter for someone you love or your future self. Choose when it opens. Until then, it stays sealed.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "A sealed private letter beside the red Intezaar digital post box" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intezaar — Letters That Are Meant to Wait",
    description: "A private digital letter written now and opened at the chosen moment.",
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
  description: "Private digital letters for someone you love, your future self and moments worth waiting for.",
  inLanguage: "en-IN",
  publisher: { "@type": "Organization", name: "Intezaar" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${sourceSans.variable} ${lora.variable}`}>
      <body>
        <InstalledAppShell />
        <RecipientLinkRecovery />
        {children}
        <FirstPartyAnalytics />
        <MetaPixel />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </body>
    </html>
  );
}
