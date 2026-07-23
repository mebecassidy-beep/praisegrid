import type { Metadata } from "next";

export const SITE_URL = "https://praisegrid.com";
export const SITE_NAME = "Praisegrid";

/**
 * Next replaces the whole `openGraph`/`twitter` object when a page defines
 * its own (no deep merge with the root layout's defaults), so every page
 * override needs to re-supply siteName/type/locale itself - this helper
 * keeps that consistent instead of repeating it per page.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
