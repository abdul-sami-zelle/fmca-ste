import { Suspense } from "react";
import ProductArchive from "../[category]/[product-archive]/page";

export async function generateMetadata() {
    return {
        title: `Searched Products - Furniture Mecca`,
        description: `Browse our Furniture Mecca collection`,
    };
}

export default function ActiveCategoryPage() {
    return (
        <Suspense>
            <ProductArchive productArchiveHading={`Search Result for:`} />  
        </Suspense>
    )
}