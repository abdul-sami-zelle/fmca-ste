import ShippingAndDeliveryClient from "@/UI/Components/ShippingAndDeliveryClient/ShippingAndDeliveryClient";

export async function generateMetadata() {
  return {
    title: "Shipping & Delivery - Furniture Mecca",
    description: "Shipping & Delivery - Furniture Mecca",
     alternates: {
      canonical: `https://myfurnituremecca.com/shipping-and-delivery`,
    },
    openGraph: {
      title: "Shipping & Delivery - Furniture Mecca",
      description: "Shipping & Delivery - Furniture Mecca",
      url: "https://myfurnituremecca.com/shipping-and-delivery",
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
  
  export default function ShippingAndDelivery() {
    return <ShippingAndDeliveryClient  />
  }