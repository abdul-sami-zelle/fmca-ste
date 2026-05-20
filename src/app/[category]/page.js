import CategoriesClient from "@/UI/Components/CategoryClient/CategoryClient";


export async function generateMetadata({ params }) {
  const resolvedParam = await params
  const { category } = resolvedParam;


  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${category}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: `Free Delivery & Free Setup | ${category} – Furniture Sale | Furniture Mecca`,
        description: "Browse our collection of quality furniture.",
      };
    }

    const { seoData } = await res.json();

    if (!seoData || seoData.length === 0) {
      return {
        title: `Free Delivery & Free Setup | ${category} – Furniture Sale | Furniture Mecca`,
        description: "Browse our collection of quality furniture.",
      };
    }

    const meta = seoData[0].meta;
    const slug = seoData[0].slug;

    const imageUrl = meta.og_image?.startsWith("http")
      ? meta.og_image
      : `https://fmapi.myfurnituremecca.com${meta.og_image.startsWith("/") ? meta.og_image : `/${meta.og_image}`}`;

    return {
      title: `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca` || `Free Delivery & Free Setup | ${seoData[0].name} – Furniture Sale | Furniture Mecca`,
      description: meta.description || "Browse our collection of quality furniture.",
      keywords: meta.keywords || undefined,
      alternates: {
        canonical: meta.canonical_url || `https://myfurnituremecca.com/${slug}`,
      },
      openGraph: {
        title: `${meta.og_title} - Furniture Mecca` || meta.title,
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
        title: `Free Delivery & Free Setup | ${meta.x_title} – Furniture Sale | Furniture Mecca` || `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`,
        description: meta.x_description || meta.description,
        images: [imageUrl], // ✅ Match OG image for consistency
      },
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return {
      title: "Free Delivery & Free Setup | Category – Furniture Sale | Furniture Mecca",
      description: "Browse our collection of quality furniture.",
    };
  }
}

export default async function Category({ params }) {
  const resolvedParams = await params;
  const {category} = resolvedParams;

  return <CategoriesClient category={category} />
}



