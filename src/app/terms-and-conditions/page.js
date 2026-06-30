import TermsAndConditionsClient from "@/UI/Components/TermsAndConditionsClient/TermsAndConditionsClient";

export async function generateMetadata() {
  return {
    title: "Terms & Conditions - Furniture Mecca",
    description: "Terms & Conditions - Furniture Mecca",
     alternates: {
      canonical: `https://myfurnituremecca.com/terms-and-conditions`,
    },
    openGraph: {
      title: "Terms & Conditions - Furniture Mecca",
      description: "Terms & Conditions - Furniture Mecca",
      url: "https://myfurnituremecca.com/terms-and-conditions",
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
  
  
  
  
  export default function TermsAndConditions() {
    return <TermsAndConditionsClient />
  }