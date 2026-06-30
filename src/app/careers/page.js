import CareersClient from "@/UI/Components/CareerClient/CareerCient";

export async function generateMetadata() {
  return {
    title: "Career - Furniture Mecca",
    description: "Career - Furniture Mecca",
    alternates: {
        canonical:`https://myfurnituremecca.com/careers`,
      },
    openGraph: {
      title: "Career - Furniture Mecca",
      description: "Career - Furniture Mecca",
      url: "https://myfurnituremecca.com/careers",
      images: [
        {
          url: "/favicon.png", // ✅ static fallback image
          width: 1200,
          height: 630
        }
      ]
    }
  };
}
  
  export default function Careers({ params }) {
    return <CareersClient params={params} />
  }