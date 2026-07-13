import CheckoutClient from "@/UI/Components/CheckoutClient/CheckoutClient";

export async function generateMetadata({ params }) {
    return {
      title: `Checkout | Furniture Mecca`,
      description: `Browse our ${params} collection`,
      alternates: {
      canonical: `https://myfurnituremecca.com/check-out`,
    },
    };
  }


export default async function Summary({ params }) {
    return <CheckoutClient params={params.slug} />
  }