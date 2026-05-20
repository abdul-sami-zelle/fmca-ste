'use client'

import React, { useEffect, useRef, useState } from 'react'
import './Financing.css'
import { url } from '../../../utils/api'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'





const FinancingClient = () => {

    const [financingPageData, setFinancingPageData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all')
    const [mobileIndex, setMobileIndex] = useState(0);
    const [mobCategory, setMobCategory] = useState('all');
    const [financingCategories, setFincancingCategories] = useState({
        desktop: [], mobile: []
    })
    const getFinancingPageData = async () => {
        try {
            const response = await axios.get(`${url}/api/v1/pages/financing/get`);
            setFinancingPageData(response.data.financingPage || []);
            const uniqueByCategory = (arr) => {
                const seen = new Set();
                return arr.filter((item) => {
                    if (seen.has(item.category)) return false;
                    seen.add(item.category);
                    return true;
                });
            };

            setFincancingCategories({
                desktop: uniqueByCategory([
                    { title: "All Financings", category: "all" },
                    ...response.data.financingPage.slides.desktop.map((item) => ({
                        title: item.description,
                        category: item.title,
                    })),
                ]),
                mobile: uniqueByCategory([
                    { title: "All Financings", category: "all" },
                    ...response.data.financingPage.slides.mobile.map((item) => ({
                        title: item.description,
                        category: item.title,
                    })),
                ]),
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (financingPageData === null) {
            getFinancingPageData();
        }
    }, [financingPageData]);

    const handleCategorySelect = (item, index) => {
        setActiveCategory(item.category);
        setCurrentIndex(index); // store the actual index
        hoverIndexRef.current = null;
        lastMovedIndex.current = null;
        moveIndicator(index);
    }

    const handleMobileIndex = (item, index) => {
        setMobCategory(item.category)
        setMobileIndex(index)
    }

    // sliding bg
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const categoryRefs = useRef([]);
    const indicatorRef = useRef(null);

    const hoverIndexRef = useRef(null);
    const lastMovedIndex = useRef(null);

    const moveIndicator = (forcedIndex = null) => {
        const index =
            hoverIndexRef.current != null
                ? hoverIndexRef.current
                : forcedIndex !== null
                    ? forcedIndex
                    : currentIndex; // fallback to currentIndex (not category string!)

        if (lastMovedIndex.current === index) return;

        const el = categoryRefs.current[index];
        if (el && indicatorRef.current) {
            indicatorRef.current.style.width = `${el.offsetWidth}px`;
            indicatorRef.current.style.left = `${el.offsetLeft}px`;
            indicatorRef.current.style.opacity = '1';
            lastMovedIndex.current = index;
        }
    };

    const handleHover = (index) => {
        setHoveredCategory(index);
        hoverIndexRef.current = index;
        moveIndicator();
    };

    const handleLeave = () => {
        setHoveredCategory(null);
        hoverIndexRef.current = null;
        moveIndicator(currentIndex); // 👈 slide back to active index
    };

    useEffect(() => {
        moveIndicator();
    }, [activeCategory, financingCategories]);

    useEffect(() => {
        const handleResize = () => {
            lastMovedIndex.current = null;
            moveIndicator();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='financing-main-container'>
            <div className='financing-top-head-contianer'>
                <p className='pay-our-way-heading'>PAY YOUR WAY</p>
                <p className='financing-para'>Make financing easy, find the right plan for you</p>
                <h3 className='financing-main-heading'>Payment Solutions, Leasing and Traditional Financing</h3>
            </div>
            {financingPageData ? (
                financingPageData && <div className='financing-page-main-banner-container'>
                    <Image src={url + financingPageData?.main_banner?.desktop?.image_url} width={1800} height={360} alt='main-desktop-banner' className='financing-desktop-main-banner' />
                    <Image src={url + financingPageData?.main_banner?.mobile?.image_url} width={480} height={360} alt='main-desktop-banner' className='financing-mobile-main-banner' />
                </div>
            ) : (
                <div className='financing-page-main-banner-shimmer'></div>
            )}

            {/* <div className='mobile-finance-secondBanner'>
                <Image src={'/Assets/Furniture Mecca/Financing/download 146.png'} width={480} height={155} alt='mobile-second-banner' />
            </div>
            <div className='desktop-finance-secondBanner'>
                <Image src={url + "/uploads/media/Pages/home/financeSlider/1737797410760_405_Finance-Page-Points-2.jpg"} width={2200} height={100} alt='desktop-second-banner' />
            </div> */}
            {/* <LeaseToOwn /> */}

            <div className='financing-categories-main-container'>
                <div className='financing-categories-desktop-contianer'>
                    {financingCategories.desktop.length > 0 ? (
                        financingCategories.desktop.map((item, index) => (
                            <p
                                key={index}
                                ref={(el) => (categoryRefs.current[index] = el)}
                                className={`desktop-category-item ${currentIndex === index && hoveredCategory === null ? 'active-desktop-category' : ''} ${hoveredCategory === index ? 'hovered-category' : ''}`}
                                onClick={() => handleCategorySelect(item, index)}
                                onMouseEnter={() => handleHover(index)}
                                onMouseLeave={handleLeave}
                            >
                                {item.title}
                            </p>
                        ))
                    ) : (
                        <div className='financing-category-shimmers-contianer'>
                            {
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className='financing-category-shimmer'></div>
                                ))
                            }
                        </div>
                    )}
                    {financingCategories.desktop.length > 0 && (
                        <span className='indicator' ref={indicatorRef}></span>
                    )}
                </div>
                <div className='financing-categories-mobile-contianer'>
                    {financingCategories.mobile.length > 0 ? (
                        financingCategories.mobile.map((item, index) => (
                            <p
                                key={index}
                                className={`mobile-category-item ${mobileIndex === index ? 'active-mobile-category' : ''}`}
                                onClick={() => handleMobileIndex(item, index)}
                            >
                                {item.title}
                            </p>
                        ))
                    ) : (
                        <div className='category-mobile-shimmer-contianer'>
                            {
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className='financing-category-shimmer'></div>
                                ))
                            }
                        </div>


                    )}
                </div>
            </div>


            <div className='payment-solutions desktopview' style={{ flexDirection: "column" }}>

                {financingPageData &&
                    financingPageData?.slides?.desktop
                        ?.filter((item) =>
                            activeCategory === "all" ? true : item.title === activeCategory
                        )
                        .map((items, index) => (
                            <Link
                                key={index}
                                className={`payment-solution-single-card`}
                                href={items?.link_url}
                                target="_blank"
                            >
                                <Image
                                    src={url + items?.image_url}
                                    width={1800}
                                    height={280}
                                    alt={items?.alt_text || ""}
                                />


                            </Link>
                        ))
                }



            </div>
            <div className='payment-solutions mobileview' style={{ flexDirection: "column" }}>

                {financingPageData &&
                    financingPageData?.slides?.mobile
                        ?.filter((item) =>
                            mobCategory === "all" ? true : item.title === mobCategory
                        )
                        .map((items, index) => (
                            <Link
                                key={index}
                                className={`payment-solution-single-card`}
                                href={items?.link_url}
                                target="_blank"
                            >
                                <Image
                                    src={url + items?.image_url}
                                    width={767}
                                    height={120}
                                    alt={items?.alt_text || ""}
                                />
                            </Link>
                        ))
                }
            </div>

        </div>
    )
}

export default FinancingClient
