'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";

const LastCallContext = createContext();

export const LastCallProvider = ({ children }) => {
    const [lastCallData, setLastCallData] = useState(null); // State to store fetched data
    const [products, setProducts] = useState(null);   // State to store fetched products
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(false);    // State to track loading status
    const [error, setError] = useState(null);         // State to store error (if any)

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
    const fetchData = async () => {
        const api = `${url}/api/v1/last-call-page/get`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            setLoading(true);
            const data = await fetchWithRetry(api, options);
            await fetchProductsByCategory(data?.data?.subCategory)

            setLastCallData(data); // Store the fetched data in state
        } catch (error) {
            setError(error.message);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch products by category
    const fetchProductsByCategory = async (categoryUid) => {
        // Check if products are already fetched
        if (products) {
            return;
        }

        const finalApi = `${url}/api/v1/products/by-category?categoryUid=${categoryUid}&per_page=60`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            setLoading(true);
            const data = await fetchWithRetry(finalApi, options);
            setProducts(data.products); // Store the fetched products in state
            setTotalProducts(data.pagination.totalProducts)
        } catch (error) {
            setError(error.message);
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch sales data on component mount       
    }, []);

    return (
        <LastCallContext.Provider value={{ lastCallData, products, fetchProductsByCategory, loading, error, totalProducts }}>
            {children}
        </LastCallContext.Provider>
    );
};

export const useLastCallContext = () => useContext(LastCallContext);