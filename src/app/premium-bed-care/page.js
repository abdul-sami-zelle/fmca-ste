import PremiumBedCare from './premiumBedCare';

export async function generateMetadata() {
  return {
    title: "Premium Protection Plan  | Furniture Mecca",
    description: "Premium Protection Plan  | Furniture Mecca",
     alternates: {
      canonical: `https://myfurnituremecca.com/premium-bed-care`,
    },
    openGraph: {
      title: "Premium Protection Plan | Furniture Mecca",
      description: "Premium Protection Plan | Furniture Mecca",
      url: "https://myfurnituremecca.com/premium-bed-care",
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

const PremiumBedCareMain = () => {
  return <PremiumBedCare />
}

export default PremiumBedCareMain