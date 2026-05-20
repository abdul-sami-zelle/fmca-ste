'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { url } from '../../utils/api';
import axios from 'axios';
import useSWR from 'swr';

// Create a Context for the blogs
const BlogsContext = createContext();

// Create a provider component
export const BlogsProvider = ({ children }) => {
    const [activeCategory, setActiveCategory] = useState(0);

    const [blogs, setBlogs] = useState([]);

    const customCategory = {
        _id: null,
        name: "All Blogs",
        slug: "all-blogs",
        description: "This category contains all blog posts.",
        status: "active",
        parentCategory: null,
        metaKeywords: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
    };

    const [blogCategories, setBlogCategories] = useState([]);
    const [blogCategoryCount, setBlogCategoryCount] = useState(0);
    const [isBlogCatLoading, setIsBlogCatLoading] = useState(false);
    const [isBlogLoading, setIsBlogLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)

    const blogCategoryApi = `${url}/api/v1/blog-categories/get`;

    const fetcher = (url) => fetch(url).then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    });

    const { data: blogCategoryData, error: blogCategoryError, isLoading: blogCategoryLoading } = useSWR(blogCategoryApi, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 1000 * 60 * 60 * 24 * 365
    });

    useEffect(() => {
        if (blogCategoryError && blogCategoryCount < 3) {
            const timer = setTimeout(() => {
                setBlogCategoryCount(prev => prev + 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [blogCategoryError, blogCategoryCount]);

    useEffect(() => {
        if (blogCategoryData) {
            setBlogCategories([customCategory, ...blogCategoryData.categories]);
        }
    }, [blogCategoryData]);

    useEffect(() => {
        setIsBlogCatLoading(blogCategoryLoading);

    }, [blogCategoryLoading])

    const fetchBlogs = async (categoryId, page = 1) => {
        const api = `/api/v1/blogs/get`;
        try {
            setIsBlogLoading(true);
            let response
            if (categoryId === null) {
                response = await axios.get(`${url}${api}?page=${page}&limit=12`);
                if (response.status === 200 && response.data.blogs) {
                    setBlogs(response.data.blogs);
                    setTotalPages(response.data.totalPages)
                    setCurrentPage(response.data.currentPage)
                    setIsBlogLoading(false)
                } else {
                    console.error("UnExpected Error", response.status);
                }
            } else {
                
                response = await axios.get(`${url}${api}?category=${categoryId}&page=${page}&limit=12`);
                setBlogs(response.data.blogs);
                setTotalPages(response.data.totalPages)
                setCurrentPage(response.data.currentPage)
                setIsBlogLoading(false)
            }
        } catch (error) {
            console.error("UnExpected Server Error", error);
            setIsBlogLoading(false)
        } finally {setIsBlogLoading(false)}
    }

    useEffect(() => {

        fetchBlogs(null)
    }, [])

    return (
        <BlogsContext.Provider value={{
            blogs,
            setBlogs,
            blogCategories,
            setBlogCategories,
            fetchBlogs,
            activeCategory,
            setActiveCategory,
            isBlogLoading,
            isBlogCatLoading,
            totalPages, 
            setTotalPages,
            currentPage, 
            setCurrentPage,
        }}>
            {children}
        </BlogsContext.Provider>
    );
};

export const useBlog = () => useContext(BlogsContext);