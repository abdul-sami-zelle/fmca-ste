'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";

const ActiveSalePageContext = createContext();

export const ActiveSalePageProvider = ({ children }) => {
    const [salesData, setSalesData] = useState(null); // State to store fetched data
    const [products, setProducts] = useState(null);   // State to store fetched products
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(false);    // State to track loading status
    const [error, setError] = useState(null);         // State to store error (if any)
    const [noProducts, setNoProducts] = useState(false)


    // Utility function to handle retries
    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (retries > 0) {
                console.warn(`Retrying... ${retries} attempts left`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(url, options, retries - 1, delay);
            }
            throw new Error(`Failed to fetch data: ${error.message}`);
        }
    };

    // Main function to fetch sales data
    const fetchData = async (endpoint) => {
        const api = `${url}/api/v1/sales-page/get${endpoint ? `?${new URLSearchParams(endpoint)}` : ''}`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            setLoading(true);
            const data = await fetchWithRetry(api, options);
            await fetchProductsByCategory(data?.data?.categoryData?.slug)
            setSalesData(data); // Store the fetched data in state
        } catch (error) {
            setError(error.message);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // // Function to fetch products by category
    // const fetchProductsByCategory = async (categoryUid) => {
    //     // Check if products are already fetched
    //     if (products) {
    //         return;
    //     }

    //     const api = `${url}/api/v1/products/by-category?categorySlug=${categoryUid}&per_page=60&isSortCatWise=1`;
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     };

    //     try {
    //         setLoading(true);
    //         const data = await fetchWithRetry(api, options);
    //         if(!data?.products?.length > 0) {
    //             setNoProducts(true)
    //         }
    //         setProducts(data.products); // Store the fetched products in state
    //         setTotalProducts(data.pagination.totalProducts)
    //     } catch (error) {
    //         setError(error.message);
    //         console.error('Error fetching products:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchProductsByCategory = async (categoryUid) => {
        if (products) return;
        setError(null); // clear any stale error before trying again
        const api = `${url}/api/v1/products/by-category?categorySlug=${categoryUid}&per_page=60&isSortCatWise=1`;
        try {
            setLoading(true);
            const data = await fetchWithRetry(api, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
            if (!data?.products?.length > 0) setNoProducts(true);
            setProducts(data.products);
            setTotalProducts(data.pagination.totalProducts);
        } catch (error) {
            setError(error.message);
            setProducts([]); // <-- IMPORTANT: settle it to a real, empty value instead of leaving it null forever
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch sales data on component mount       
    }, []);

    return (
        <ActiveSalePageContext.Provider value={{ salesData, products, fetchProductsByCategory, loading, error, totalProducts, noProducts, setNoProducts }}>
            {children}
        </ActiveSalePageContext.Provider>
    );
};

export const useActiveSalePage = () => useContext(ActiveSalePageContext);