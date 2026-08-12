import ProductDisplayWrapper from "./productDisplayWrapper";
import Head from "next/head";

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

    // aggregateRating: product.average_rating
    //   ? {
    //       "@type": "AggregateRating",
    //       ratingValue: product.average_rating,
    //       reviewCount: product.rating_count,
    //     }
    //   : undefined,

    aggregateRating:
      parseFloat(product.average_rating || 0) > 0
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
      title: "Product | Furniture Mecca",
      description: "Shop Furniture at Furniture Mecca. Best deals on furniture in Philadelphia. Free delivery and setup. Order today!",
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
      ? `${meta.title} | Furniture Mecca`
      : "Product | Furniture Mecca",

    description: `Shop ${meta.title} at Furniture Mecca. Best deals on furniture in Philadelphia. Free delivery and setup. Order today!` || "Shop Furniture at Furniture Mecca. Best deals on furniture in Philadelphia. Free delivery and setup. Order today!",

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: meta.og_title
        ? `${meta.og_title} | Furniture Mecca`
        : meta.title
          ? `${meta.title} | Furniture Mecca`
          : "Product | Furniture Mecca",
      description: `Shop ${meta.og_title} at Furniture Mecca. Best deals on furniture in Philadelphia. Free delivery and setup. Order today!` || "Shop Furniture at Furniture Mecca. Best deals on furniture in Philadelphia. Free delivery and setup. Order today!",
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