// import { createContext, useState, useContext, } from "react";

// const ProductPageContext = createContext()

// export const ProductPageProvider = ({ children }) => {

//     const [singleProductData,setSingleProductData] = useState({});
//     const [selectedVariationUid,setSelectedVariationUid]= useState(null);
//     const [selectedVariationData,setSelectedVariationData]=useState(null);

//     function findObjectByUID(uid, list) {
//         return list?.find(obj => obj?.uid === uid) || null;
//     }
    
    
//     return (
//         <ProductPageContext.Provider value={{ 
//             singleProductData,setSingleProductData,
//             selectedVariationData,setSelectedVariationData,
//             selectedVariationUid,setSelectedVariationUid,
//             findObjectByUID
//              }}>
//             {children}
//         </ProductPageContext.Provider>
//     )
// }

// export const useProductPage = () => useContext(ProductPageContext);


import { createContext, useState, useContext } from "react";

const ProductPageContext = createContext();

export const ProductPageProvider = ({ children, initialVariation = null, initialProduct = null }) => {

  const [singleProductData, setSingleProductData] = useState(initialProduct);
  const [selectedVariationUid, setSelectedVariationUid] = useState(
    initialVariation?.uid || null
  );
  const [selectedVariationData, setSelectedVariationData] = useState(initialVariation);

  function findObjectByUID(uid, list) {
    return list?.find(obj => obj?.uid === uid) || null;
  }

  return (
    <ProductPageContext.Provider value={{
      singleProductData, setSingleProductData,
      selectedVariationData, setSelectedVariationData,
      selectedVariationUid, setSelectedVariationUid,
      findObjectByUID
    }}>
      {children}
    </ProductPageContext.Provider>
  );
};

export const useProductPage = () => useContext(ProductPageContext);