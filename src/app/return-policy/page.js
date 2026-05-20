import ReturnPolicyClient from "@/UI/Components/ReturnPolicyClient/ReturnPolicyClient";

export async function generateMetadata() {
  return {
    title: "Return Policy - Furniture Mecca",
    description: "Return Policy - Furniture Mecca",
    openGraph: {
      title: "Return Policy - Furniture Mecca",
      description: "Return Policy - Furniture Mecca",
      url: "https://myfurnituremecca.com/return-policy",
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




export default function ReturnPolicy() {
    return <ReturnPolicyClient />
}