import LoginRegisterClient from "@/UI/Components/LoginRegisterClient/LoginRegisterClient";

export async function generateMetadata() {
  return {
    title: "Login & Register | Furniture Mecca",
    description: "Login & Register | Furniture Mecca",
     alternates: {
      canonical: `https://myfurnituremecca.com/my-account`,
    },
    openGraph: {
      title: "Login & Register | Furniture Mecca",
      description: "Login & Register | Furniture Mecca",
      url: "https://myfurnituremecca.com/my-account",
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
    return <LoginRegisterClient  />
  }