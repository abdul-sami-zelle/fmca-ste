import WishListClient from "@/UI/Components/WishListClient/WishListClient";

export async function generateMetadata() {
  return {
    title: "Wishlist - Furniture Mecca",
    description: "Wishlist - Furniture Mecca",
    openGraph: {
      title: "Wishlist - Furniture Mecca",
      description: "Wishlist - Furniture Mecca",
      url: "https://myfurnituremecca.com/wishlist",
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
  
  
  
  
  export default function LoginRegister() {
    return <WishListClient  />
  }