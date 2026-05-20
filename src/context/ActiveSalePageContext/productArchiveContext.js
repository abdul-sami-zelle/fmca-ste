'use client'

// import { useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ProductArchiveContext = createContext();

export const ProductArchiveProvider = ({ children }) => {
  // const searchParams = useSearchParams();
  // const pageFromURL = parseInt(searchParams.get('page') || '1');

  const [products, setProducts] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [activePageIndex, setActivePageIndex] = useState(1);

  const [priceRange, setPriceRange] = useState([130, 900]);
  const [selectedRelevanceValue, setSelectedRelevanceValue] = useState('Recent')

  const [allFilters, setAllFilters] = useState(() => {
    if(typeof window !== "undefined") {
      const savedData = localStorage.getItem("filterData");
      return savedData ? JSON.parse(savedData) : []; // Default to empty array
    }
  });


  // Save data to localStorage whenever it updates

  useEffect(() => {
    localStorage.setItem("filterData", JSON.stringify(allFilters));
  }, [allFilters]);

  const [colorValue, setColorValue] = useState([]);
  const [collectionValue, setCollectionValue] = useState([])
  const [brandValue, setBrandValue] = useState([])
  const [isFeatured, setIsFeatured] = useState([])
  const [isStock, setIsStock] = useState([])

  const [subCategories, setSubCategories] = useState([])

  const [categoryData, setCategoryData] = useState([]);
  const [totalPages, setTotalPages] = useState();

  const sortProducts = (criteria) => {
    let sortedProducts = [...products];
    switch (criteria) {
      case 'Recent':
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'By Price (Low to High)':
        sortedProducts.sort((a, b) => a.sale_price - b.sale_price);
        break
      case 'By Price (High to Low)':
        sortedProducts.sort((a, b) => b.sale_price - a.sale_price);
        break;
      case 'Alphabetic (A to Z)':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break
      case 'Alphabetic (Z to A)':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break
      case 'By Ratings (Low to High)':
        sortedProducts.sort((a, b) => parseFloat(a.average_rating) - parseFloat(b.average_rating));
        break
      case 'By Ratings (High to Low)':
        sortedProducts.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating));
        break

      default:
        sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setProducts(sortedProducts)
  }

  useEffect(() => { sortProducts(selectedRelevanceValue) }, [selectedRelevanceValue])

  return (
    <ProductArchiveContext.Provider
      value={{
        products,
        setProducts,
        activePage,
        setActivePage,
        activePageIndex,
        setActivePageIndex,
        priceRange,
        setPriceRange,
        allFilters,
        setAllFilters,
        subCategories,
        setSubCategories,
        categoryData,
        setCategoryData,
        totalPages,
        setTotalPages,
        colorValue,
        setColorValue,
        sortProducts,
        selectedRelevanceValue,
        setSelectedRelevanceValue,
        collectionValue, 
        setCollectionValue,
        brandValue, 
        setBrandValue,
        isFeatured, 
        setIsFeatured,
        isStock, 
        setIsStock,
      }}
    >
      {children}
    </ProductArchiveContext.Provider>
  );
};

export const useProductArchive = () => useContext(ProductArchiveContext);