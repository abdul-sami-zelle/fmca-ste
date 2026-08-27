import Cart from "./cart";

export async function generateMetadata() {
  return {
    title: "Cart | Furniture Mecca",
    description: "Cart | Furniture Mecca",

    alternates: {
      canonical: "https://myfurnituremecca.com/cart",
    },

    openGraph: {
      title: "Cart | Furniture Mecca",
      description: "Cart | Furniture Mecca",
      url: "https://myfurnituremecca.com/cart",

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


export default async function CartPage({ searchParams }) {

  // =========================================================
  // 1. GET QUERY PARAMETERS SERVER SIDE
  // =========================================================

  const params = await searchParams;

  const productsParam = params?.products;
  const cartOrigin = params?.cart_origin;


  // =========================================================
  // 2. PARSE META PRODUCTS
  //
  // Expected:
  //
  // ?products=6254:1,5705:1
  //
  // Result:
  //
  // [
  //   {
  //     uid: 6254,
  //     quantity: 1
  //   },
  //   {
  //     uid: 5705,
  //     quantity: 1
  //   }
  // ]
  // =========================================================

  let metaProducts = [];

  if (
    cartOrigin === "meta_shops" &&
    productsParam
  ) {

    metaProducts = productsParam
      .split(",")
      .map((item) => {

        // -----------------------------------------
        // Must be UID:QUANTITY
        // -----------------------------------------

        const parts = item.split(":");

        if (parts.length !== 2) {
          return null;
        }


        const [uidString, quantityString] = parts;


        // -----------------------------------------
        // UID must contain numbers only
        // -----------------------------------------

        if (!/^\d+$/.test(uidString)) {
          return null;
        }


        // -----------------------------------------
        // Quantity must contain numbers only
        // -----------------------------------------

        if (!/^\d+$/.test(quantityString)) {
          return null;
        }


        const uid = Number(uidString);
        const quantity = Number(quantityString);


        // -----------------------------------------
        // UID validation
        // -----------------------------------------

        if (
          !Number.isSafeInteger(uid) ||
          uid <= 0
        ) {
          return null;
        }


        // -----------------------------------------
        // Quantity validation
        // -----------------------------------------

        if (
          !Number.isSafeInteger(quantity) ||
          quantity <= 0
        ) {
          return null;
        }


        return {
          uid,
          quantity,
        };

      })
      .filter(Boolean);
  }


  console.log(
    "META PRODUCTS FROM URL:",
    metaProducts
  );


  // =========================================================
  // 3. FETCH PRODUCTS FROM YOUR API
  // =========================================================

  let metaProductData = [];

  if (metaProducts.length > 0) {

    try {

      const response = await fetch(
        "https://fmapi.myfurnituremecca.com/api/v1/products/adjust-cart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            products: metaProducts,
          }),

          cache: "no-store",
        }
      );


      // -----------------------------------------
      // API FAILED
      // -----------------------------------------

      if (!response.ok) {

        console.error(
          "Meta products API failed:",
          response.status,
          response.statusText
        );

      } else {

        const data = await response.json();


        console.log(
          "META PRODUCTS API RESPONSE:",
          data
        );


        metaProductData =
          Array.isArray(data?.products)
            ? data.products
            : [];
      }

    } catch (error) {

      console.error(
        "Failed to fetch Meta products:",
        error
      );

    }
  }


  // =========================================================
  // 4. FILTER ONLY PRODUCTS THAT CAN BE ADDED TO CART
  //
  // Conditions:
  //
  // product_status === "published"
  // out_of_stock === false
  // outSource === false
  // =========================================================

  const availableMetaProducts =
    metaProductData.filter(
      (product) =>
        product.product_status === "published" &&
        product.out_of_stock === false &&
        product.outSource === false
    );


  // =========================================================
  // 5. LOG RESULTS
  // =========================================================

  console.log(
    "ALL META PRODUCTS:",
    metaProductData
  );

  console.log(
    "AVAILABLE META PRODUCTS:",
    availableMetaProducts
  );

  console.log(
    "UNAVAILABLE META PRODUCTS:",
    metaProductData.filter(
      (product) =>
        product.product_status !== "published" ||
        product.out_of_stock === true ||
        product.outSource === true
    )
  );


  // =========================================================
  // 6. SEND PRODUCTS TO CLIENT CART COMPONENT
  // =========================================================

  return (
    <Cart
      metaProducts={availableMetaProducts}
      isMetaShop={cartOrigin === "meta_shops"}
      unavailableProducts={metaProductData}
    />
  );
}