'use client'

import React, { useEffect, useState } from 'react'
import './RelatedCategories.css'
import Link from 'next/link';
import { url } from '@/utils/api';
import { useProductArchive } from '@/context/ActiveSalePageContext/productArchiveContext';
import { useParams } from 'next/navigation';

const RelatedCategories = ({ navigationType }) => {

    const categorySlug = useParams()
    const {categoryData, setCategoryData} = useProductArchive()

    

    async function fetchHeaderPayloads() {
        try {
            const response = await fetch(`${url}/api/v1/header-payloads/get`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error.message);
            throw error;
        }
    }

    const [relatedCategoriesData, setRelatedCategoriesData] = useState([])

    useEffect(() => {
        if (navigationType !== 'POP' || relatedCategoriesData.length === 0) {
            fetchHeaderPayloads().then(data => {
                setCategoryData(data.data[0].categories)
            }).catch(error => {
                console.error(error);
            });
        }

        const unfilteredCategories = categoryData.find((item) => item.category_slug === categorySlug.category);

        setRelatedCategoriesData(unfilteredCategories?.subCategories)
    }, [])

    useEffect(() => { 
        const unfilteredCategories = categoryData.find((item) => item.category_slug === categorySlug.category);

        setRelatedCategoriesData(unfilteredCategories?.subCategories)
    }, [categoryData])

    

    return (
        <div className='related-categories-main-div'>
            <h3>Related Categories</h3>
            <div className='related-categories-items'>
                {relatedCategoriesData && relatedCategoriesData.map((item, index) => {
                    return <Link key={index} href={`/${categorySlug.category}/${item.slug}`}>{item.name}</Link>
                })}
            </div>
        </div>
    )
}

export default RelatedCategories
