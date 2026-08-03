import FurnitureAtEveryBudgetClient from "@/UI/Components/FurnitureForBudgetClient/FurnitureForBudgetClient";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { category, price } = await params;

  const categoryName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const priceAmount = price.replace(/^under-/, "");

  const title = `${categoryName} Furniture Under $${priceAmount} | Furniture Mecca`;
  const description = `Shop ${categoryName} furniture under $${priceAmount} at Furniture Mecca.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://myfurnituremecca.com/furniture-for-every-budget/${category}/${price}`,
    },
    openGraph: {
      title,
      description,
      url: `https://myfurnituremecca.com/furniture-for-every-budget/${category}/${price}`,
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function FurnitureAtEveryBudget({ params }) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FurnitureAtEveryBudgetClient params={resolvedParams} />
    </Suspense>
  )
}