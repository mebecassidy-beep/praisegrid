import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { SupportChat } from "@/components/support/support-chat";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://praisegrid.com";
const SITE_DESCRIPTION =
  "Aggregate reviews, generate AI responses, and optimize your Google Maps SEO.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Praisegrid | Local Business Review Management",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Praisegrid | Local Business Review Management",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Praisegrid",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praisegrid | Local Business Review Management",
    description: SITE_DESCRIPTION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Praisegrid",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "49",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <SupportChat />
      </body>
    </html>
  );
}
