'use client'

import React, { useEffect, useState } from 'react';
import './BreadCrumb.css';
// import { useLocation } from 'react-router-dom';
import Link from 'next/link';
import { useNavigation } from '../../context/BreadCrumbContext/NavigationContext';
import { FaHouseChimney } from 'react-icons/fa6';
import rightArrow from "../../Assets/right-arrow.png";

const Breadcrumb = ({ category, productName, sku, categorySlug }) => {
    const [parentCategory, setParentCategory] = useState(null)
    const [parentCategorySlug, setParentCategorySlug] = useState(null)
    // const location = useLocation();
    const location = 'living-room'

    // useEffect(() => {
    //     if (location.pathname.includes('product')) {
    //         // Set the parent category if the route is a product page
    //         const mainCategory = category?.find(main => main.is_main === 1);
    //         setParentCategory(mainCategory ? mainCategory.name : null);
    //         setParentCategorySlug(mainCategory ? mainCategory.slug : null)
    //     } else {
    //         // Reset parent category if not on a product page
    //         setParentCategory(null);
    //     }
    // }, [category, location.pathname]);

    // const { navigationHistory } = useNavigation();
    const pathnames = location?.pathname?.split('/').filter(x => x);

    // const fullPathNames = [...navigationHistory, ...pathnames];

    // if (fullPathNames.length === 0) {
    //     return null; // Don't show anything if on the home page
    // }

    // Ensure previous route is retained on product pages
    // if (location.pathname.includes('product') && parentCategorySlug) {
    //     fullPathNames.splice(fullPathNames.indexOf('product'), 1, parentCategorySlug); // Replace "product" with categorySlug
    // }

    // const pagePath = window.location.pathname
    const pagePath = 'living/rooms';
    const basePath = pagePath?.split('/')[1]; // Extracts "product"
    const result = `/${basePath}`;

    return (
        <nav>
            <ol className={`bread-crumb-list ${result === '/product' ? 'hide-breadcrumb' : ''}`}>
                {/* Home Link */}
                <li style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Link href="/">
                        <FaHouseChimney style={{ height: "20px", width: "20px", marginTop: "4px" }} />
                    </Link>
                </li>

                {/* Dynamic Breadcrumb Links */}
                {/* {fullPathNames.map((pathname, index) => {
                    // Determine if the current route is the product page
                    const isProductPage = location.pathname.includes('product') && index === fullPathNames.length - 1;


                    // Determine if the current route is the category
                    const isCategory = pathname === 'product' && parentCategory?.name;

                    const name = isProductPage && productName
                        ? productName // Use SKU if on product page
                        : pathname === 'product' && parentCategory
                            ? parentCategory
                            : isCategory
                                ? category // Replace "single-product" with category
                                : pathname
                                    .split('-') // Split slug into words
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                                    .join(' '); // Join words with spaces
                    const routeTo = isProductPage && categorySlug && index === fullPathNames.length - 1
                        ? `/product/${sku}`  // Ensure that SKU does not redirect to the category page
                        : isCategory
                            ? `/${categorySlug}` // Go to categorySlug for category links
                            : `/${fullPathNames.slice(0, index + 1).join('/')}`; // Default behavior 
                    //  Dynamic Breadcrumb Links 

                    return (
                        <li
                            className={`bread_links`}
                            style={
                                {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                }
                            }
                            key={routeTo}
                        >
                            <span >
                                <img
                                    src={rightArrow}
                                    style={
                                        { height: "8px", width: "10px" }
                                    }
                                    alt="arrow"
                                />
                            </span>
                            {index === fullPathNames.length - 1 ? (
                                <span
                                    className={`bread_links_sub active ${index === fullPathNames.length - 1 ? 'active-last-bread-link' : ''}`}
                                    style={{ marginLeft: "10px", fontSize: "13px", marginBottom: "1px" }}
                                >
                                    {name}
                                </span>
                            ) : (
                                <Link
                                    className="bread_links_sub"
                                    style={{ marginLeft: "0px", fontSize: "14px", marginBottom: "1px", }}
                                    href={routeTo}
                                >
                                    {name}
                                </Link>
                            )}

                        </li>
                    );
                })} */}
            </ol>
        </nav>
    );
};

export default Breadcrumb;


