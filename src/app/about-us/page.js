import AboutUsClient from "@/UI/Components/AboutusClient/AboutusClient";

export async function generateMetadata() {
  return {
    title: "About Us | Furniture Mecca",
    description: "About Us | Furniture Mecca",
    alternates: {
        canonical:`https://myfurnituremecca.com/about-us`,
    },
    openGraph: {
      title: "About Us | Furniture Mecca",
      description: "About Us  Furniture Mecca",
      url: "https://myfurnituremecca.com/about-us",
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

export default function AboutUs() {
    
    return <AboutUsClient  />
}