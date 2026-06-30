import FinancingClient from "@/UI/Components/FinancingClient/FinancingClient";

export async function generateMetadata() {
  return {
    title: "Financing - Furniture Mecca",
    description: "Financing - Furniture Mecca",
        alternates: {
      canonical: `https://myfurnituremecca.com/financing`,
    },
    openGraph: {
      title: "Financing - Furniture Mecca",
      description: "Financing - Furniture Mecca",
      url: "https://myfurnituremecca.com/financing",
   
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
  
  
  
  
  export default function Category() {
    return <FinancingClient />
  }