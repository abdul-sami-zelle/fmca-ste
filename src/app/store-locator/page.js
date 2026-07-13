import StoreLocatorClient from "@/UI/Components/StoreLocatorClient/StoreLocatorClient";

export async function generateMetadata() {
  return {
    title: "Find Furniture or Mattress Store Near You | Furniture Mecca",
    description:
      "Find a Furniture Mecca store near you. Explore our furniture and mattress showrooms, get directions, view store hours, and shop living room, bedroom, dining room, office furniture, and mattresses at your nearest location.",
    keywords: [
      "furniture store near me",
      "mattress store near me",
      "Furniture Mecca locations",
      "furniture showroom",
      "furniture store locator",
      "mattress showroom",
      "living room furniture",
      "bedroom furniture",
      "dining room furniture",
      "furniture stores"
    ],
     alternates: {
      canonical: `https://myfurnituremecca.com/store-locator`,
    },
  };
}

export default function StoreLocator() {
  return <StoreLocatorClient />;
}