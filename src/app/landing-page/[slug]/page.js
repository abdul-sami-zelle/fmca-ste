import { notFound } from "next/navigation";
import LandingPagesClient from "@/UI/Components/LandingPagesClient/LandingPagesClient";

async function getSEOData(slug) {
  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/landing-pages/get-landing-page-seo/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const result = await res.json();

    if (!result.success) return null;

    return result;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const seoResponse = await getSEOData(slug);

  // 🔴 HARD CODED FALLBACK (like your category page)
  if (!seoResponse) {
    return {
      title: `Furniture Mecca`,
      description:
        "Browse our collection of quality furniture and home décor at Furniture Mecca.",
      keywords: "furniture, home decor, sofa, bed, dining, furniture mecca",
      openGraph: {
        title: "Furniture Mecca",
        description:
          "Browse our collection of quality furniture and home décor.",
        url: `https://myfurnituremecca.com/landing-page/${slug}`,
        siteName: "Furniture Mecca",
        images: [
          {
            url: "https://myfurnituremecca.com/favicon.png",
            width: 1200,
            height: 630,
          },
        ],
        type: "website",
      },
    };
  }

  const meta = seoResponse.data;

  const imageUrl = meta.og_image
    ? meta.og_image.startsWith("http")
      ? meta.og_image
      : `https://fmapi.myfurnituremecca.com${
          meta.og_image.startsWith("/")
            ? meta.og_image
            : `/${meta.og_image}`
        }`
    : "https://myfurnituremecca.com/favicon.png";

  return {
    title:
      `${meta.title}  Furniture Mecca` ||
      `Furniture Mecca `,
    description:
      meta.description ||
      "Browse our collection of quality furniture and home décor at Furniture Mecca.",
    keywords:
      meta.keywords ||
      "furniture, sofa, bed, dining, home decor",

    alternates: {
      canonical:
        meta.canonical_url ||
        `https://myfurnituremecca.com/landing-page/${slug}`,
    },

    robots: meta.robots || "index,follow",

    openGraph: {
      title: `${meta.og_title} | Furniture Mecca` ||
       `${meta.title} | Furniture Mecca`,
      description: meta.og_description || meta.description,
      url: `https://myfurnituremecca.com/landing-page/${slug}`,
      siteName: "Furniture Mecca",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: meta.og_title || meta.title,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
          title: `${meta.x_title} | Furniture Mecca` ||
       `${meta.title} | Furniture Mecca`,
      description:
        meta.x_description ||
        meta.description ||
        "Browse our collection of furniture.",
      images: [imageUrl],
    },
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;

  const seoResponse = await getSEOData(slug);

  // 🔴 404 ONLY IF YOU WANT REAL MISSING PAGE
  if (!seoResponse) {
    notFound();
  }

  return <LandingPagesClient slug={slug} />;
}