import { notFound } from "next/navigation";
import ProductArchive from "./productArchive";

export async function generateMetadata({ params }) {
  const resolvedParam = await params;
  const subcategorySlug = resolvedParam["product-archive"];

  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${subcategorySlug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: `Free Delivery & Free Setup | ${params.category} – Furniture Sale | Furniture Mecca`,
        description: "Explore our products collection.",
      };
    }

    const { seoData } = await res.json();

    if (!seoData || seoData.length === 0) {
      return {
        title: `Free Delivery & Free Setup | ${params.category} – Furniture Sale | Furniture Mecca`,
        description: "Explore our Categories collection.",
      };
    }

    const meta = seoData[0].meta;
    const slug = seoData[0].slug;

    const imageUrl = meta.og_image?.startsWith("http")
      ? meta.og_image
      : `https://fmapi.myfurnituremecca.com${
          meta.og_image.startsWith("/")
            ? meta.og_image
            : `/${meta.og_image}`
        }`;

    return {
      title:
        `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca` ||
        `Free Delivery & Free Setup | ${seoData[0].name} – Furniture Sale | Furniture Mecca`,
      description:
        meta.description || "Explore our category collection.",
      keywords: meta.keywords || undefined,
      alternates: {
        canonical:
          meta.canonical_url || `https://myfurnituremecca.com/${slug}`,
      },
      openGraph: {
        title:
          `Free Delivery & Free Setup | ${meta.og_title} – Furniture Sale | Furniture Mecca` ||
          `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`,
        description: meta.og_description || meta.description,
        url: `https://myfurnituremecca.com/${slug}`,
        siteName: "Furniture Mecca",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: seoData[0].name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title:
          `Free Delivery & Free Setup | ${meta.x_title} – Furniture Sale | Furniture Mecca` ||
          `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`,
        description: meta.x_description || meta.description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return {
      title: "Free Delivery & Free Setup | Category - Furniture Mecca",
      description: "Explore our Category collection.",
    };
  }
}

// export default async function ProductArchivePage({ params }) {
//   const resolvedParam = await params;
//   const subcategorySlug = resolvedParam["product-archive"];

//   // 🔴 ONLY ADDITION: VALIDATE SLUG FOR REAL 404
//   const res = await fetch(
//     `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${subcategorySlug}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     notFound();
//   }

//   const { seoData } = await res.json();

//   if (!seoData || seoData.length === 0) {
//     notFound();
//   }

//   return <ProductArchive />;
// }


export default async function ProductArchivePage({ params }) {
  const resolvedParam = await params;
  const categorySlug = resolvedParam.category;
  const subcategorySlug = resolvedParam["product-archive"];

  const res = await fetch(
    `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${subcategorySlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const { seoData } = await res.json();

  if (!seoData || seoData.length === 0) {
    notFound();
  }

  // ✅ Validate parent category slug
  if (
    seoData[0].parentSlug &&
    seoData[0].parentSlug !== categorySlug
  ) {
    notFound();
  }

  return <ProductArchive />;
}