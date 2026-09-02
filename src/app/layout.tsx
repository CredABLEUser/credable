import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://credableclub.com";
const TAGLINE = "Build credit. Master leverage.";
const DESCRIPTION =
  "CredABLE is the coach in your pocket for building credit, managing money wisely, and learning to use leverage to build what you actually want out of life. Free to start, no credit card required.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `CredABLE — ${TAGLINE}`,
    template: "%s — CredABLE",
  },
  description: DESCRIPTION,
  keywords: [
    "build credit",
    "credit coach",
    "personal finance app",
    "credit repair help",
    "financial literacy",
    "manage money",
    "leverage credit",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CredABLE",
    title: `CredABLE — ${TAGLINE}`,
    description: DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CredABLE — Build credit. Master leverage." }],
  },
  twitter: {
    card: "summary_large_image",
    title: `CredABLE — ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CredABLE",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4b2e73",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CredABLE",
  url: SITE_URL,
  slogan: TAGLINE,
  description: DESCRIPTION,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-ink">{children}</body>
    </html>
  );
}
