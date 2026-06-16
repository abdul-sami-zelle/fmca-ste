import { notFound } from "next/navigation";
import SingleBlog from "./SingleBlog"; // adjust path if needed

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const res = await fetch(
      `https://fmapi.myfurnituremecca.com/api/v1/blogs/get-blog-seo?slug=${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        title: `Free Delivery & Free Setup | ${slug} – Furniture Sale | Furniture Mecca`,
        description: "Read our latest blog posts about furniture and home décor.",
      };
    }

    const { seoData } = await res.json();

    if (!seoData || seoData.length === 0) {
      return {
        title: `Free Delivery & Free Setup | ${slug} – Furniture Sale | Furniture Mecca`,
        description: "Read our latest blog posts about furniture and home décor.",
      };
    }

    const meta = seoData[0].meta;
    const blogSlug = seoData[0].slug;

    const imageUrl = meta.og_image
      ? meta.og_image.startsWith("http")
        ? meta.og_image
        : `https://fmapi.myfurnituremecca.com${
            meta.og_image.startsWith("/") ? meta.og_image : `/${meta.og_image}`
          }`
      : null;

    return {
      title:
        `Free Delivery & Free Setup | ${meta.title} – Furniture Sale | Furniture Mecca` ||
        `Free Delivery & Free Setup | ${slug} – Furniture Sale | Furniture Mecca`,
      description:
        meta.description || "Read our latest blog posts about furniture and home décor.",
      keywords: meta.keywords || undefined,
      alternates: {
        canonical:
          meta.canonical_url ||
          `https://myfurnituremecca.com/single-blog/${blogSlug}`,
      },
      openGraph: {
        title: `Free Delivery & Free Setup | ${meta.og_title || meta.title} – Furniture Sale | Furniture Mecca`,
        description: meta.og_description || meta.description,
        url: `https://myfurnituremecca.com/single-blog/${blogSlug}`,
        siteName: "Furniture Mecca",
        type: "article",
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: meta.title || slug,
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title:
          `Free Delivery & Free Setup | ${meta.x_title || meta.title} – Furniture Sale | Furniture Mecca`,
        description: meta.x_description || meta.description,
        ...(imageUrl && { images: [imageUrl] }),
      },
    };
  } catch (error) {
    console.error("Error fetching blog SEO data:", error);
    return {
      title: "Free Delivery & Free Setup | Blog  – Furniture Sale | Furniture Mecca",
      description: "Read our latest blog posts about furniture and home décor.",
    };
  }
}

export default async function SingleBlogPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 404 check
  const res = await fetch(
    `https://fmapi.myfurnituremecca.com/api/v1/blogs/get-blog-seo?slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const { seoData } = await res.json();

  if (!seoData || seoData.length === 0) {
    notFound();
  }

  return <SingleBlog />;
}