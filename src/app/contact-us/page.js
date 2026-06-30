import ContactClient from "@/UI/Components/ContactClient/ContactClient";

export async function generateMetadata() {
  return {
    title: "Contact Us - Furniture Mecca",
    description: "Contact Us - Furniture Mecca",
    openGraph: {
      title: "Contact Us - Furniture Mecca",
      description: "Contact Us - Furniture Mecca",
      url: "https://myfurnituremecca.com/contact-us",
       alternates: {
      canonical: `https://myfurnituremecca.com/contact-us`,
    },
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

export default function Contact() {
    return <ContactClient />
}