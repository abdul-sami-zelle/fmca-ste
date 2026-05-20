import SaleClient from "@/UI/Components/SaleClient/SaleClient";


// export async function generateMetadata({ params }) {
//   const resolvedParam = await params
//   // const { slug } = params;



//   try {
//     const res = await fetch(
//       `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${resolvedParam.slug}`,
//       { cache: "no-store" }
//     );



//     if (!res.ok) {
//       // console.log()
//       return {
//         title: `${resolvedParam.slug} – Save Up to 75% Furniture Mecca`,
//         description: "Browse our collection of quality furniture.",
//       };
//     }


//     const { seoData } = await res.json();

//     if (!seoData || seoData.length === 0) {
//       return {
//         title: `${resolvedParam.slug} – Save Up to 75% Furniture Mecca`,
//         description: "Browse our collection of quality furniture.",
//       };
//     }

//     if (seoData || seoData.length > 0) {
//       const meta = seoData[0].meta;

//       return {
//         title: `Free Delivery & Free Setup | ${meta.title} – Save Up to 75% Furniture Mecca`,
//         description: "Browse our collection of quality furniture.",
//       };
//     }

//     const meta = seoData[0].meta;
//     const slug = seoData[0].slug;

//     const imageUrl = meta.og_image?.startsWith("http")
//       ? meta.og_image
//       : `https://fmapi.myfurnituremecca.com${meta.og_image.startsWith("/") ? meta.og_image : `/${meta.og_image}`}`;

//     return {
//       title: `Free Delivery & Free Setup | ${meta.title} – Save Up to 75% Furniture Mecca` || `Free Delivery & Free Setup | ${seoData[0].name} – Save Up to 75% Furniture Mecca`,
//       description: meta.description || "Browse our collection of quality furniture.",
//       keywords: meta.keywords || undefined,
//       alternates: {
//         canonical: meta.canonical_url || `https://myfurnituremecca.com/${slug}`,
//       },
//       openGraph: {
//         title: `${meta.og_title} – Save Up to 75% Furniture Mecca` || meta.title,
//         description: meta.og_description || meta.description,
//         url: `https://myfurnituremecca.com/${slug}`,
//         siteName: "Furniture Mecca",
//         images: [
//           {
//             url: imageUrl,
//             width: 1200,
//             height: 630,
//             alt: seoData[0].name,
//           },
//         ],
//         type: "website",
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: meta.x_title || meta.title,
//         description: meta.x_description || meta.description,
//         images: [imageUrl], // ✅ Match OG image for consistency
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching SEO data:", error);
//     return {
//       title: `${params.slug} – Save Up to 75% Furniture Mecca`,
//       description: "Browse our collection of quality furniture.",
//     };
//   }
// }

export async function generateMetadata({ params }) {
  const resolvedParam =  await params; // no need to await

  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/productCategory/get-seo?slug=${resolvedParam.slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
        description: "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
      };
    }

    const { seoData } = await res.json();

    if (!seoData || seoData.length === 0) {
      return {
        title: `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
        description: "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
      };
    }

    // ✅ only one success path — no early return
    const meta = seoData[0].meta;
    const slug = seoData[0].slug;

    const imageUrl = meta?.og_image?.startsWith("http")
      ? meta.og_image
      : `https://fmapi.myfurnituremecca.com${
          meta?.og_image?.startsWith("/") ? meta.og_image : `/${meta?.og_image}`
        }`;

    return {
      title:
        `${meta?.title}` ||
        `Free Delivery & Setup | Furniture Deals During Furniture Sale 2026 - Furniture Mecca`,
      description:
        meta?.description || "Free Delivery & Free Setup on furniture during Furniture Sale. Explore exclusive deals on sofas, beds & dining sets—limited stock available.",
      keywords: meta?.keywords || undefined,

      alternates: {
        canonical:
          meta?.canonical_url ||
          `https://myfurnituremecca.com/${slug}`,
      },

      openGraph: {
        title:
          `${meta?.og_title || meta?.title} – Save Up to 75% Furniture Mecca`,
        description:
          meta?.og_description || meta?.description,
        url: `https://myfurnituremecca.com/${slug}`,
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
        description:
          meta?.x_description || meta?.description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return {
      title: `${resolvedParam.slug} – Save Up to 75% Furniture Mecca`,
      description: "Browse our collection of quality furniture.",
    };
  }
}


export default function ActiveCategoryPage({ params }) {
  return <SaleClient slug={params} />
}
