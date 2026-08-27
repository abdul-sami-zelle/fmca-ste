// import SaleClient from "@/UI/Components/SaleClient/SaleClient";

// export async function generateMetadata({ params }) {
//   const resolvedParam =  await params; // no need to await

//   try {
//     const res = await fetch(
//       `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${resolvedParam.slug}`,
//       { cache: "no-store" }
//     );

//     if (!res.ok) {
//       return {
//         title: `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
//         description: "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
//       };
//     }

//     const { seoData } = await res.json();

//     if (!seoData || seoData.length === 0) {
//       return {
//         title: `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
//         description: "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
//       };
//     }

//     // ✅ only one success path — no early return
//     const meta = seoData[0].meta;
//     const slug = seoData[0].slug;

//     const imageUrl = meta?.og_image?.startsWith("http")
//       ? meta.og_image
//       : `https://fmapi.myfurnituremecca.com${
//           meta?.og_image?.startsWith("/") ? meta.og_image : `/${meta?.og_image}`
//         }`;

//     return {
//       title:
//         `${meta?.title}` ||
//         `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
//       description:
//         meta?.description || "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
//       keywords: meta?.keywords || undefined,

//       alternates: {
//         canonical:
//           `https://myfurnituremecca.com/sale/${slug}`,
//       },

//       openGraph: {
//         title:
//           `${meta?.og_title || meta?.title} – Save Up to 75% Furniture Mecca`,
//         description:
//           meta?.og_description || meta?.description,
//         url: `https://myfurnituremecca.com/${slug}`,
//         siteName: "Furniture Mecca",
//         images: [
//           {
//             url: imageUrl,
//             width: 1200,
//             height: 630,
//             alt: seoData[0]?.name,
//           },
//         ],
//         type: "website",
//       },

//       twitter: {
//         card: "summary_large_image",
//         title: meta?.x_title || meta?.title,
//         description:
//           meta?.x_description || meta?.description,
//         images: [imageUrl],
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching SEO data:", error);
//     return {
//       title: `${resolvedParam.slug} – Save Up to 75% Furniture Mecca`,
//       description: "Browse our collection of quality furniture.",
//     };
//   }
// }


// export default function ActiveCategoryPage({ params }) {
//   return <SaleClient slug={params} />
// }



import { notFound } from "next/navigation";
import { cache } from "react";
import SaleClient from "@/UI/Components/SaleClient/SaleClient";

const getSlugSeo = cache(async (slug) => {
  const res = await fetch(
    `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { ok: false, seoData: null };
  }

  const data = await res.json();
  return { ok: true, seoData: data.seoData };
});

export async function generateMetadata({ params }) {
  const resolvedParam = await params;
  const { slug } = resolvedParam;

  try {
    const { ok, seoData } = await getSlugSeo(slug);

    if (!ok || !seoData || seoData.length === 0) {
      return {
        title: `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
        description:
          "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
      };
    }

    const meta = seoData[0].meta;
    const seoSlug = seoData[0].slug;

    const imageUrl = meta?.og_image?.startsWith("http")
      ? meta.og_image
      : `https://fmapi.myfurnituremecca.com${
          meta?.og_image?.startsWith("/") ? meta.og_image : `/${meta?.og_image}`
        }`;

    return {
      title:
        `${meta?.title} | Furniture Mecca` ||
        `Furniture Mecca`,
      description:
        meta?.description ||
        "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
      keywords: meta?.keywords || undefined,

      alternates: {
        canonical: `https://myfurnituremecca.com/sale/${seoSlug}`,
      },

      openGraph: {
        title: `${meta?.og_title || meta?.title} – Save Up to 75% Furniture Mecca`,
        description: meta?.og_description || meta?.description,
        url: `https://myfurnituremecca.com/${seoSlug}`,
        siteName: "Furniture Mecca",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: seoData[0]?.name,
          },
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: meta?.x_title || meta?.title,
        description: meta?.x_description || meta?.description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return {
      title: `${slug} – Save Up to 75% Furniture Mecca`,
      description: "Browse our collection of quality furniture.",
    };
  }
}

export default async function ActiveCategoryPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { ok, seoData } = await getSlugSeo(slug);
  
  if (!ok) {
    notFound();
  }

  if (!seoData || seoData.length === 0) {
    notFound();
  }

  return <SaleClient saleName={seoData[0]?.name}  slug={slug} />;
}