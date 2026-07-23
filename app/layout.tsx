import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { SupportChat } from "@/components/support/support-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Praisegrid | Local Business Review Management",
  description:
    "Aggregate reviews, generate AI responses, and optimize your Google Maps SEO.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Praisegrid",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Aggregate reviews, generate AI responses, and optimize your Google Maps SEO.",
  url: "https://www.praisegrid.com",
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
