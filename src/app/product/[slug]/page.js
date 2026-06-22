// import ProductDisplayWrapper from "./productDisplayWrapper";

// export async function generateMetadata(props) {
//   const params = await props.params;
//   const { slug } = params;

//   const res = await fetch(
//     `https://fmapi.myfurnituremecca.com/api/v1/products/get-product-seo?slug=${slug}`,
//     { cache: "no-store" }
//   );

//   if (!res.ok) {
//     return {
//       title: "Product - Furniture Mecca",
//       description: "Browse our collection of quality furniture.",
//       alternates: {
//         canonical: `https://myfurnituremecca.com/product/${slug}`,
//       },
//     };
//   }

//   const { seoData } = await res.json();
//   const meta = seoData?.[0]?.meta || {};

//   const canonicalUrl =
//     meta.canonical_url ||
//     `https://myfurnituremecca.com/product/${slug}`;

//   return {
//     title: meta.title
//       ? `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`
//       : "Free Delivery & Free Setup | Product - Furniture Sale | Furniture Mecca",

//     description:
//       meta.description ||
//       "Browse our collection of quality furniture.",

//     alternates: {
//       canonical: canonicalUrl,
//     },

//     openGraph: {
//       title:
//         meta.og_title
//           ? `Free Delivery & Free Setup | ${meta.og_title} – Furniture Sale | Furniture Mecca`
//           : `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`,

//       description: meta.og_description || meta.description,

//       url: canonicalUrl,

//       type: "website",

//       images: meta.og_image
//         ? [
//             {
//               url: meta.og_image.startsWith("http")
//                 ? meta.og_image
//                 : `https://fmapi.myfurnituremecca.com/${meta.og_image.replace(
//                     /^\//,
//                     ""
//                   )}`,
//               width: 1200,
//               height: 630,
//             },
//           ]
//         : [],
//     },
//   };
// }


// export default async function ProductDisplayPage({ params }) {
//   const { slug } = await params;

//   const res = await fetch(
//     `https://fmapi.myfurnituremecca.com/api/v1/products/get-product-seo?slug=${slug}`,
//     { cache: "no-store" }
//   );
//   console.log("schema woroking start here")

//   let schema = null;
//   console.log(res.ok,slug,res,"here is the resp pf schema")
//   if (res.ok) {
//     const data = await res.json();
//     const product = data?.seoData?.[0];

//     if (product) {
//       schema = {
//         "@context": "https://schema.org",
//         "@type": "Product",

//         name: product.name,
//         description: product.short_description || product.meta?.description,

//         sku: product.sku,
//         gtin: product.gtin,
//         mpn: product.mpn,

//         brand: {
//           "@type": "Brand",
//           name: product.brand || "Furniture Mecca"
//         },

//         image: product.images?.map((img) =>
//           img.image_url?.startsWith("http")
//             ? img.image_url
//             : `https://fmapi.myfurnituremecca.com${img.image_url}`
//         ),

//         aggregateRating: product.average_rating
//           ? {
//               "@type": "AggregateRating",
//               ratingValue: product.average_rating,
//               reviewCount: product.rating_count
//             }
//           : undefined,

//         offers: {
//           "@type": "Offer",
//           url: `https://myfurnituremecca.com/product/${product.slug}`,
//           priceCurrency: "USD",
//           price: product.sale_price || product.regular_price,

//           availability:
//             product.manage_stock?.quantity > 0
//               ? "https://schema.org/InStock"
//               : "https://schema.org/OutOfStock"
//         }
//       };
//     }
//   }

//   return (
//     <>
//       {/* ✅ SCHEMA */}
//       {schema && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(schema)
//           }}
//         />
//       )}

//       {/* PAGE UI */}
//       <ProductDisplayWrapper params={params} />
//     </>
//   );
// }


import ProductDisplayWrapper from "./productDisplayWrapper";

// ── Helper: build schema from product data ────────────────────
function buildSchema(product, slug) {
  if (!product) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,
    description: product.short_description || product.meta?.description,

    sku: product.sku,
    gtin: product.gtin,
    mpn: product.mpn,

    brand: {
      "@type": "Brand",
      name: product.brand || "Furniture Mecca",
    },

    image: product.images?.map((img) =>
      img.image_url?.startsWith("http")
        ? img.image_url
        : `https://fmapi.myfurnituremecca.com${img.image_url}`
    ),

    aggregateRating: product.average_rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.average_rating,
          reviewCount: product.rating_count,
        }
      : undefined,

    offers: {
      "@type": "Offer",
      url: `https://myfurnituremecca.com/product/${slug}`,
      priceCurrency: "USD",
      price: product.sale_price || product.regular_price,
      availability:
        product.manage_stock?.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

// ── Helper: fetch product (single call) ──────────────────────
async function fetchProduct(slug) {
  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/products/get-by-slug/${slug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.products?.[0] || null;
  } catch {
    return null;
  }
}

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata(props) {
  const { slug } = await props.params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product - Furniture Mecca",
      description: "Browse our collection of quality furniture.",
      alternates: {
        canonical: `https://myfurnituremecca.com/product/${slug}`,
      },
    };
  }

  const meta = product.meta || {};
  const canonicalUrl =
    meta.canonical_url || `https://myfurnituremecca.com/product/${slug}`;

  return {
    title: meta.title
      ? `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`
      : "Free Delivery & Free Setup | Product - Furniture Mecca",

    description: meta.description || "Browse our collection of quality furniture.",

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: meta.og_title
        ? `Free Delivery & Free Setup | ${meta.og_title} – Furniture Sale | Furniture Mecca`
        : meta.title
          ? `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`
          : "Free Delivery & Free Setup | Product - Furniture Mecca",
      description: meta.og_description || meta.description,
      url: canonicalUrl,
      type: "website",
      images: meta.og_image
        ? [
            {
              url: meta.og_image.startsWith("http")
                ? meta.og_image
                : `https://fmapi.myfurnituremecca.com/${meta.og_image.replace(/^\//, "")}`,
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function ProductDisplayPage({ params }) {
  const { slug } = await params;

  // Single API call — product contains meta + all schema data
  const productData = await fetchProduct(slug);
  const schema = buildSchema(productData, slug);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <ProductDisplayWrapper
        params={params}
        productAPIData={productData}
      />
    </>
  );
}