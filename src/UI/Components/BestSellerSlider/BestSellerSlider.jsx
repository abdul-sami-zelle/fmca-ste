import React, { useState, useEffect } from 'react';
import './BestSellerSlider.css';
import Link from 'next/link';
import BestSellerProductCard from '../BestSellerProductCard/BestSellerProductCard';
import star from '../../../Assets/icons/Star 19.png'

// import axios from 'axios';
import { formatedPrice, url } from '../../../utils/api';
import { useSingleProductContext } from '../../../context/singleProductContext/singleProductContext';
import { useCart } from '../../../context/AddToCart/addToCart';
import { useList } from '../../../context/wishListContext/wishListContext';
import BestSellerProductCardShimmer from '../BestSellerProductCard/BestSellerProductCardShimmer';
import RatingReview from '../starRating/starRating';
import { VscHeartFilled, VscHeart } from "react-icons/vsc";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/utils/Fetcher';

import BestSellerMobileShimmer from '../BestSellerProductCard/BestSellerMobileShimmer';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import { BiSolidShoppingBag } from 'react-icons/bi';


const BestSellerSlider = (
    {
        allProducts,
        setAllProducts,
        bestSellerNav1,
        setBestSellerNav1,
        setShowSnakeBar,
        setSnakeBarMessage
    }) => {

    // States and Variables
    const router = useRouter()
    const [currentSlug, setCurrentSlug] = useState();
    const [loading, setLoading] = useState(false);
    const bestSellerProductApi = currentSlug ? `${url}/api/v1/products/get-best-selling-products?category=${currentSlug}&parent=0` : null;
    const [bestSellerProductCount, setBestSellerProductCount] = useState(0)
    const { data: bestSellerProductData, error: betSellerProductError, isLoading: bestSellerProductLoading } = useSWR(bestSellerProductApi, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 1000 * 60 * 60 * 24 * 365
    })

    if (betSellerProductError && bestSellerProductCount < 3) {
        setTimeout(() => {
            setBestSellerProductCount(bestSellerCount + 1);
        }, 1000)
    }

    useEffect(() => {
        if (bestSellerProductData) {
            setAllProducts(bestSellerProductData.products);
        }
    })

    const bestSellerApi = `${url}/api/v1/best-seller-home/get`
    const [bestSellerCount, setBestSellerCount] = useState(0);
    const { data: bestSellerMainData, error: bestSellerError, isLaoding: bestSellerLoading } = useSWR(bestSellerApi, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 1000 * 60 * 60 * 24 * 365,
        onSuccess: () => {
            // setBannerLoading(false)
        }
    })

    if (bestSellerError && bestSellerCount < 3) {
        setTimeout(() => {
            setBestSellerCount(bestSellerCount + 1);
        }, 1000);
    }

    useEffect(() => {
        if (bestSellerMainData) {
            setBestSellerNav1(bestSellerMainData)
            setCurrentSlug(bestSellerMainData[0].slug)
            // getBestSellerProducts(bestSellerMainData[0].slug);
        }
    }, [bestSellerMainData])



    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerPage] = useState(6);
    const [totalPages] = useState(Math.ceil(allProducts.length / cardsPerPage));
    const [applyFilter, setApplyFilter] = useState(false);
    const [width, setWidth] = useState(0);
    const [activeItem, setActiveItem] = useState(0)
    const [MobileActiveIndex, setMobileActiveIndex] = useState(0)
    const [mobIndex, setMobIndex] = useState(0)
    const { addSingleProduct } = useSingleProductContext();
    const { addToCart } = useCart()
    const { addToList, isInWishList, removeFromList } = useList()
    const [listed, setListed] = useState(false);

    // Functions
    const handleActiveItem = (index) => {
        setActiveItem(index)
        setLoading(true)
    }

    const handleMobileActiveindex = (index) => {
        // setActiveItem(index)
        setMobIndex(index)
    }


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResizer = () => setWidth(window.innerWidth);

            // Set initial width on client
            setWidth(window.innerWidth);

            window.addEventListener("resize", handleResizer);
            return () => window.removeEventListener("resize", handleResizer);
        }
    }, []);

    // product slice to show 6 product maxx
    const handleCardClicked = (item) => {

        addSingleProduct(item)
        addToCart(item)
        router.push(`/product/${item.slug}`)

    }


    const handleWishList = async (item) => {

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

    const handleMobileNavClick = (index) => {
        setApplyFilter(true);
        setTimeout(() => {
            setApplyFilter(false);
            setMobIndex(index)
        }, 1000)
    }

    // Get the slice of products to display based on the current page
    const getDisplayedCards = () => {
        const publishedProductes = allProducts.filter(product => product.status === 'published');
        const productWithDiscount = publishedProductes.map((product) => {
            let newPrice = parseFloat(product.regular_price);
            if (product.discount && product.discount.is_discountable === 1) {
                const oldPrice = parseFloat(product.regular_price); // Convert regular_price to a number
                const discountValue = parseFloat(product.discount.discount_value);

                // Calculate the new price based on the discount type
                if (product.discount.discount_type === 'percentage' && !isNaN(discountValue)) {
                    newPrice = parseFloat(product.regular_price) - (parseFloat(product.regular_price) * (discountValue / 100));
                    newPrice = parseFloat(newPrice.toFixed(2));
                } else if (product.discount.discount_type === 'currency' && !isNaN(discountValue)) {
                    newPrice = oldPrice - discountValue;
                    newPrice = parseFloat(newPrice.toFixed(2));
                }
                else {
                    newPrice = oldPrice;
                }
            }
            return {
                ...product,
                newPrice
            }
        })
        // setLoading(false)
        // return productWithDiscount.slice(start, end);
        return productWithDiscount;
    };

    const ratingStars = [
        { icon: star },
        { icon: star },
        { icon: star },
        { icon: star },
        { icon: star }
    ]
    useEffect(() => {
    }, [MobileActiveIndex])



    return (
        <>
            <div className="best-seller-slider-container">

                <div className='best-seller-imaage-and-cards'>

                    <Link
                        className='best-seller-slider-main-banner'
                        href={`${bestSellerNav1[activeItem]?.slug}${bestSellerNav1[activeItem]?.image?.link_url}`}
                    >
                        {bestSellerLoading ? (
                            <div className='best-seller-main-cover-shimmer'></div>
                        ) : (


                            bestSellerNav1[activeItem]?.image?.image_url ? (
                                <img
                                    key={bestSellerNav1[activeItem].image.image_url}
                                    src={url + bestSellerNav1[activeItem].image.image_url}
                                    alt='main banner'
                                />
                            ) : null

                        )}
                    </Link>


                    <div className='best-seller-slider-div'>
                        <div className='best-seller-slider-menu-bar'>
                            <h3>Best Seller</h3>
                            <div className='best-seller-menu-bar'>
                                {bestSellerNav1.map((item, index) => (
                                    <p
                                        key={index}
                                        className={activeItem === index ? 'active' : ''}
                                        onClick={async () => {
                                            setCurrentSlug(item.slug);
                                            handleActiveItem(index)
                                            await mutate();
                                        }}
                                    >
                                        {item.Heading}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className='best-seller-slider-main-banner-mobile-view'>
                            {/* <Image src={url + bestSellerNav1[activeItem]?.image?.image_url} width={540} height={810} alt='main banner' /> */}
                            {bestSellerNav1[activeItem]?.image?.image_url && (
                                <Image
                                    src={url + bestSellerNav1[activeItem].image.image_url}
                                    width={540}
                                    height={810}
                                    alt="main banner"
                                />
                            )}
                        </div>

                        <div className='products-slider-container'>

                            {/* <GridSlider
                                slidesData={allProducts.filter(product => product.status === 'published')}
                                renderSlide={(item) => (
                                    <BestSellerProductCard
                                        productData={item}
                                        isDiscountable={item.discount.is_discountable === 1 ? true : false}
                                        key={item._id}
                                        productMainImage={item.images?.[0]?.image_url}
                                        starIcon={ratingStars}
                                        reviews={'200'}
                                        productName={item.name}
                                        oldPrice={item.regular_price}
                                        newPrice={item.newPrice}
                                        listed={listed}
                                        handleCardClicked={() => handleCardClicked(item)}
                                        handleWishListClicked={() => handleWishList(item)}
                                    />
                                )}
                            /> */}


                            <div className='best-seller-slider-wrapper' style={{ overflow: 'hidden' }}>
                                <div
                                    className='best-seller-slider'
                                    style={{
                                        transform: `translateX(-${(currentIndex / totalPages) * 100}%)`
                                    }}>
                                    {!bestSellerProductLoading ?
                                        getDisplayedCards().slice(currentIndex, currentIndex + cardsPerPage).map((item, index) => (
                                            <BestSellerProductCard
                                                productData={item}
                                                isDiscountable={item.discount.is_discountable === 1 ? true : false}
                                                key={item._id}
                                                productMainImage={item.images?.[0]?.image_url}
                                                starIcon={ratingStars}
                                                reviews={'200'}
                                                productName={item.name}
                                                oldPrice={item.regular_price}
                                                newPrice={item.newPrice}
                                                listed={listed}
                                                handleCardClicked={() => handleCardClicked(item)}
                                                handleWishListClicked={() => handleWishList(item)}
                                            />
                                        )) :
                                        <>
                                            <BestSellerProductCardShimmer />
                                            <BestSellerProductCardShimmer />
                                            <BestSellerProductCardShimmer />
                                            <BestSellerProductCardShimmer />
                                            <BestSellerProductCardShimmer />
                                            <BestSellerProductCardShimmer />
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View  */}
                <div className='best-saller-mobile-container'>
                    <h2>Best Seller</h2>
                    <div className='mobile-card-nav-container'>
                        {
                            getDisplayedCards()?.length !== 0 ? (
                                bestSellerNav1.map((item, index) => (
                                    <h2
                                        key={index}
                                        className={`mobile-best-seller-nav-item ${mobIndex === index ? 'mobile-seller-nav-active' : ''}`}
                                        onClick={() => {
                                            setCurrentSlug(item.slug)
                                            handleMobileNavClick(index)
                                            handleMobileActiveindex(index)
                                        }}
                                    >
                                        {item.Heading}
                                    </h2>
                                ))
                            ) : (
                                <div className='mobile-best-seller-products-nav-shimmer'>
                                    <div className='mobile-seller-nav-item-shimmer'></div>
                                    <div className='mobile-seller-nav-item-shimmer'></div>
                                    <div className='mobile-seller-nav-item-shimmer'></div>
                                </div>
                            )
                        }
                    </div>

                    <div className='mobile-view-cards-main-container'>
                        {/* <div className='mobile-best-seller-cart-container'>
                            <div className='mobile-best-sseller-card-bag-container'>
                                <BiSolidShoppingBag size={20} className='mobile-tranding-now-cart-bag' />
                            </div>
                        </div> */}

                        {bestSellerProductLoading ? (
                            <BestSellerMobileShimmer width={'85%'} />
                        ) : (

                            <SwiperSlider
                                slidesData={getDisplayedCards()}
                                renderSlide={(item) => (
                                    // <div key={item._id} className="blog-cards-container">
                                    <Link key={item._id} href={{ pathname: `/product/${item?.slug}`, state: item }} className='best-seller-card-main-container'>
                                        <div className='mobile-best-seller-cart-wishlist-container'>
                                            {
                                                isInWishList(item?._id) ? (
                                                    <VscHeartFilled
                                                        size={25}
                                                        style={{ color: 'var(--orange-fill)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleWishList(item);
                                                        }}
                                                    />
                                                ) : (
                                                    <VscHeart
                                                        size={25}
                                                        style={{ color: 'var(--orange-fill)' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleWishList(item);
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
                                                <BiSolidShoppingBag size={20} className='mobile-tranding-now-cart-bag' />
                                            </div>
                                        </div>

                                        
                                    </Link>
                                    // </div>
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


        </>
    );
};

export default BestSellerSlider;
