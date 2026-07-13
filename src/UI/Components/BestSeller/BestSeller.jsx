'use client'

import React, { useState, useEffect } from 'react';
import './BestSeller.css';
import { formatedPrice, url } from '../../../utils/api';

// Assets
import { VscHeartFilled, VscHeart } from "react-icons/vsc";

// Components 
import BestSellerProductCard from '../BestSellerProductCard/BestSellerProductCard';
import BestSellerProductCardShimmer from '../BestSellerProductCard/BestSellerProductCardShimmer';
import { useList } from '../../../context/wishListContext/wishListContext';
import { usePathname, useRouter } from 'next/navigation';
import { useLPContentContext } from '@/context/LPContentContext/LPContentContext';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/utils/Fetcher';
import Link from 'next/link';
import RatingReview from '../starRating/starRating';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import BestSellerMobileShimmer from '../BestSellerProductCard/BestSellerMobileShimmer';
import { BiSolidShoppingBag } from 'react-icons/bi';



const BestSeller = () => {

    // States and variables
    const [loading, setLoading] = useState(true);
    const [mainBanner, setMainBanner] = useState();
    const [allProducts, setAllProducts,] = useState([]);
    const [currentSlug, setCurrentSlug] = useState();
    const [activeItem, setActiveItem] = useState(0);
    const router = useRouter()

    const { bestSelling, bestSellerNav1, } = useLPContentContext()

    useEffect(() => {
        setMainBanner(bestSelling.categories[0].image)
        setCurrentSlug(bestSelling.categories[0].slug)
    }, []);

    useEffect(() => {
        setMainBanner(bestSelling.categories[0].image)
        setCurrentSlug(bestSelling.categories[0].slug)
    }, [bestSelling]);

    // const categorySeller = currentSlug ?? `${url}/api/v1/products/by-category?categorySlug=${currentSlug}&best_selling_product=1&per_page=6`
    const categorySeller = currentSlug
        ? `${url}/api/v1/products/by-category?categorySlug=${currentSlug}&best_selling_product=1&per_page=6`
        : null;
    const [categorySellerCount, setCategorySellerCount] = useState(0)

    const { data: categorySellerData, error: categorySellerError, isLoading: categorySellerLoading } = useSWR(categorySeller, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        dedupingInterval: 1000 * 60 * 60 * 24 * 365
    })

    if (categorySellerError && categorySellerCount < 3) {
        setTimeout(() => {
            setCategorySellerCount(categorySellerCount + 1)
            mutate();
        }, 1000)
    }

    const handleActiveItem = (index, item) => {
        setActiveItem(index);
        setMainBanner(item?.image)
        setCurrentSlug(item?.slug)
        handleMobileNavClick(index)
        setLoading(true);
    };

    useEffect(() => {
        if (categorySellerData) {
            setAllProducts(categorySellerData.products);
            setLoading(false)
        }
    }, [categorySellerData])

    useEffect(() => {
        mutate();
    }, [currentSlug]);

    useEffect(() => {
        if (allProducts?.length === 0) {
            setLoading(false);
        }
    }, [allProducts])



    const handleProductClick = (item) => {
        router.push(`/product/${item.slug}`);
    }

    const itemPerPage = 6
    const maxIndex = Math.ceil(allProducts && allProducts.length / itemPerPage) - 1;
    const [currentIndex, setCurrentIndex] = useState(0)
    const [mobiIndex, setMobIndex] = useState(0)
    const handleMobileNavClick = (index) => {
        setMobIndex(index);
    }

    const { addToList, isInWishList, removeFromList } = useList()


    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState();


    const handleWishlisted = async (item) => {

        const userId = localStorage.getItem('uuid');
        const getToken = localStorage.getItem('userToken');

        setShowSnakeBar(true)
        if (isInWishList(item._id)) {
            removeFromList(item._id);
            setSnakeBarMessage('Removed from wishlist')

        } else {
            addToList(item._id)

            setSnakeBarMessage('added to wishlist')
        }

        if (userId && getToken) {
            const api = `${url}/api/v1/web-users/wishlist/${userId}`;

            try {
                const response = await axios.put(api, { productId: item._id }, {
                    headers: {
                        Authorization: getToken,
                        'Content-Type': 'application/json',
                    }
                });
            } catch (error) {
                console.error("UnExpected Server Error", error);
            }
        }
    }
    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

    const pathname = usePathname();
    const handleNavigateCoverToArchive = (item) => {
        router.push(`${pathname}${item.cover_img.link_url}`)
    }

    const handleNavigateToArchive = (item) => {
        router.push(`${pathname}/${item.categories[activeItem]?.slug}`)
    }


    return (
        <>

            <div className={`category-besst-seller-main-container `}>

                <div className='category-best-seller-and-banner-container'>

                    <div className='category-best-seller-cards-section'>

                        <div className='category-best-seller-menu'>
                            <h2>Best Seller</h2>
                            {bestSelling ? (
                                <div className='category-best-seller-menu-items'>
                                    {bestSelling.categories.map((item, index) => (
                                        <h2 key={item._id} className={activeItem === index ? 'active' : ''} onClick={() => handleActiveItem(index, item)}>{item.Heading}</h2>
                                    ))}
                                </div>
                            ) : <></>}
                        </div>

                        <div className='products-slider-container'>
                            {!categorySellerLoading ? <div className='best-seller-slider' style={{ transform: `translateX(-${(currentIndex / maxIndex) * 0}%)` }}>
                                {allProducts && allProducts.slice(currentIndex * itemPerPage, (currentIndex + 1) * itemPerPage).map((item, index) => (
                                    <BestSellerProductCard
                                        key={index}
                                        productData={item}
                                        productMainImage={item.image.image_url}
                                        starIcon={item.ratingStars}
                                        reviews={item.reviewCount}
                                        productName={item.name}
                                        oldPrice={item.regular_price}
                                        newPrice={item.sale_price}
                                        handleWishListClicked={() => handleWishlisted(item)}
                                        handleCardClicked={() => handleProductClick(item)}
                                    />
                                ))}
                            </div> :

                                <div className='best-seller-slider'>


                                    <BestSellerProductCardShimmer width={'330px !important'} />
                                    <BestSellerProductCardShimmer width={'330px !important'} />
                                    <BestSellerProductCardShimmer width={'330px !important'} />
                                    <BestSellerProductCardShimmer width={'330px !important'} />
                                    <BestSellerProductCardShimmer width={'330px !important'} />
                                    <BestSellerProductCardShimmer width={'330px !important'} />


                                </div>
                            }
                        </div>

                    </div>

                    <div className='category-best-seller-banners-section'>
                        <Link href={`${pathname}${bestSelling.cover_img.link_url}`}>
                            <img 
                                src={url + bestSelling.cover_img.image_url} 
                                key={bestSelling?.cover_img?.image_url} 
                                className='banner_one' 
                                alt='banner one' 
                            />
                        </Link>
                        <Link href={`${pathname}/${bestSelling.categories[activeItem]?.slug}`}>
                            <img 
                                src={mainBanner && (url + mainBanner.image_url)} 
                                key={mainBanner?.image_url} 
                                alt='banner two' 
                                className='banner_two' 
                            />
                        </Link>
                    </div>

                </div>

                <div className='best-saller-mobile-container'>
                    <h2>Best Seller</h2>
                    <div className='mobile-card-nav-container'>
                        {bestSelling.categories.map((item, index) => (
                            <h2
                                key={index}
                                className={`mobile-best-seller-nav-item ${mobiIndex === index ? 'mobile-seller-nav-active' : ''}`}
                                onClick={() => {
                                    handleActiveItem(index, item)
                                }}
                            >
                                {item.Heading}
                            </h2>
                        ))}
                    </div>

                    <div className='mobile-view-cards-main-container'>
                        {/* <div className='mobile-best-seller-cart-container'>
                            <div className='mobile-best-sseller-card-bag-container'>
                                <BiSolidShoppingBag size={20} className='best-seller-cart-icon' />
                            </div>
                        </div> */}

                        {categorySellerLoading ? (
                            <BestSellerMobileShimmer width={'85%'} />
                        ) : (
                            <SwiperSlider
                                slidesData={allProducts}
                                renderSlide={(item) => (
                                    <Link key={item._id} href={{ pathname: `/product/${item?.slug}`, state: item }} className='best-seller-card-main-container'>

                                        <div className='mobile-best-seller-cart-wishlist-container'>
                                            {
                                                isInWishList(item?._id) ? (
                                                    <VscHeartFilled
                                                        size={25}
                                                        style={{
                                                            color: 'var(--orange-fill)',

                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleWishlisted(item);
                                                        }}
                                                    />
                                                ) : (
                                                    <VscHeart
                                                        size={25}
                                                        style={{
                                                            color: 'var(--orange-fill)',

                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleWishlisted(item);
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                        <img src={url + item?.images?.[1]?.image_url} />
                                        <div className='mobile-card-details-container'>
                                            <div className='mobile-best-seller-rating-and-review'>
                                                <RatingReview rating={item?.rating} bgColor={'#FFFFFF'} bgColor2={'#FFFFFF'} disabled={true} size={"12px"} />
                                            </div>
                                            <h3>{item?.name}</h3>
                                            <div className='mobile-best-seller-category-product-price'>
                                                <p className='mobile-best-seller-sale-price'>{formatedPrice(item?.sale_price)}</p>
                                                {item?.sale_price === '' ? <p className='mobile-best-seller-sale-price'>{formatedPrice(item?.sale_price)}</p> : <del className='mobile-best-seller-regular-price'>{formatedPrice(allProducts?.[0]?.regular_price)}</del>}
                                            </div>
                                        </div>
                                        <div className='mobile-best-seller-cart-container'>
                                            <div className='mobile-best-sseller-card-bag-container'>
                                                <BiSolidShoppingBag size={25} className='best-seller-cart-icon' />
                                            </div>
                                        </div>

                                    </Link>
                                )}
                                showDots={true}
                                showArrows={false}
                                spaceBetween={20}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    768: { slidesPerView: 4 },
                                }}
                            />
                        )}
                    </div>
                </div>

            </div>

            <SnakBar
                message={snakeBarMessage}
                openSnakeBarProp={showSnakeBar}
                setOpenSnakeBar={setShowSnakeBar}
                onClick={handleCloseSnakeBar}
            />

        </>
    )
}

export default BestSeller
