import PrivacyPolicyClient from '@/UI/Components/PrivacyPolicyClient/PrivacyPolicyClient';

export async function generateMetadata() {
  return {
    title: "Privacy Policy  – Furniture Sale | Furniture Mecca",
    description: "Privacy Policy  – Furniture Sale | Furniture Mecca",
     alternates: {
      canonical: `https://myfurnituremecca.com/privacy-policy`,
    },
    openGraph: {
      title: "Privacy Policy  – Furniture Sale | Furniture Mecca",
      description: "Privacy Policy  – Furniture Sale | Furniture Mecca",
      url: "https://myfurnituremecca.com/privacy-policy",
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

const PrivacyPolicy = () => {
  return <PrivacyPolicyClient />
}

export default PrivacyPolicy