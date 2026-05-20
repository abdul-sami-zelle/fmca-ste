import ProductDisplayWrapper from './productDisplayWrapper';

export async function generateMetadata(props) {
  const params = await props.params; 
  const { slug } = params;

  const res = await fetch(`https://fmapi.myfurnituremecca.com/api/v1/products/get-product-seo?slug=${slug}`, { cache: "no-store" });

  if (!res.ok) {
    return {
      title: "Product - Furniture Mecca",
      description: "Browse our collection of quality furniture."
    };
  }

  const { seoData } = await res.json();
  const meta = seoData?.[0]?.meta || {};

  return {
    title: meta.title ? `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca` : "Free Delivery & Free Setup | Product - Furniture Sale | Furniture Mecca",
    description: meta.description || "Browse our collection of quality furniture.",
    openGraph: {
      title: `Free Delivery & Free Setup | ${meta.og_title} – Furniture Sale | Furniture Mecca` || `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca`,
      description: meta.og_description || meta.description,
      url: `https://myfurnituremecca.com/product/${slug}`,
      images: [
        {
          url: meta.og_image?.startsWith("http") 
            ? meta.og_image 
            : `https://fmapi.myfurnituremecca.com/${meta.og_image?.replace(/^\//, '')}`,
          width: 1200,
          height: 630
        }
      ]
    }
  };
}


export default function ProductDisplayPage({ params }) {
  return <ProductDisplayWrapper params={params} />;
}
