'use client'

import React, { useState, useEffect, useRef } from "react";
import "./ActiveCategoryPage.css"
import '../Products/Products.css'
import { url, useDisableBodyScroll } from "../../../utils/api";
import { useActiveSalePage } from "../../../context/ActiveSalePageContext/ActiveSalePageContext";
import Sliderr from "../../../Global-Components/Slider/Slider";
import { useList } from "../../../context/wishListContext/wishListContext";
import heart from "../../../Assets/icons/heart-vector.png"
import { useCart } from "../../../context/cartContext/cartContext";
import QuickView from "../QuickView/QuickView";
import ProductCardTwo from "../ProductCardTwo/ProductCardTwo";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SnakBar from "@/Global-Components/SnakeBar/SnakBar";
import ProductInfoModal from "@/Global-Components/ProductInfoModal/ProductInfoModal";
import SideCart from "../Cart-side-section/SideCart";
import { useGlobalContext } from "@/context/GlobalContext/globalContext";
import DisableDelivery from "@/Global-Components/DisableDelivery/DisableDelivery";
import axios from "axios";
import Image from "next/image";
import MobileViewProductFilters from "../MobileViewProductFilters/MobileViewProductFilters";
import Link from "next/link";
import ShowRoomContainer from "../showRoomContainer/showRoomContainer";
import ProductCardLifeStyle from "../ProductCardTwo/ProductCardTwoLifeStyle";

    const SalePageShimmer = ({ count = 6 }) => (
        <div className="sale-page-shimmer-grid">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    className="sale-page-shimmer-card"
                    key={index}
                >
                    <div className="sale-page-shimmer-image" />

                    <div className="sale-page-shimmer-line sale-page-shimmer-title" />

                    <div className="sale-page-shimmer-line sale-page-shimmer-price" />

                    <div className="sale-page-shimmer-line sale-page-shimmer-small" />
                </div>
            ))}
        </div>
    );


    const SaleSliderShimmer = () => (
        <div className="sale-slider-shimmer">
            <div className="sale-slider-shimmer-inner" />
        </div>
    );


export default function SaleClient({ saleName }) {

    const router = useRouter();

    const {
        salesData,
        products,
        totalProducts
    } = useActiveSalePage();

    const filterRequestRef = useRef(0);

    const [hasNoProducts, setHasNoProducts] = useState(false);

    /* Start with loading true so shimmer appears immediately */
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const [sortedProducts, setSortedProducts] = useState([]);


    /* ================================
       PRODUCT
    ================================= */

    const handleProductClick = (item) => {
        router.push(`/product/${item.slug}`);
    };


    /* ================================
       QUICK VIEW
    ================================= */

    const [quickViewProduct, setQuickViewProduct] = useState({});
    const [quickViewClicked, setQuickView] = useState(false);

    const [activeGrid] = useState('single-col');


    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item);
    };


    /* ================================
       WISHLIST
    ================================= */

    const {
        addToList,
        removeFromList,
        isInWishList
    } = useList();


    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState();


    const handleWishList = async (item) => {

        const userId = localStorage.getItem('uuid');

        const getToken =
            localStorage.getItem('userToken');


        setShowSnakeBar(true);


        if (isInWishList(item._id)) {

            removeFromList(item._id);

            setSnakeBarMessage(
                'Removed from wishlist'
            );

        } else {

            addToList(item._id);

            setSnakeBarMessage(
                'added to wishlist'
            );
        }


        if (userId && getToken) {

            const api =
                `${url}/api/v1/web-users/wishlist/${userId}`;


            try {

                await axios.put(
                    api,
                    {
                        productId: item._id
                    },
                    {
                        headers: {
                            Authorization: getToken,
                            'Content-Type':
                                'application/json',
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "UnExpected Server Error",
                    error
                );
            }
        }
    };


    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false);
    };


    /* ================================
       CART
    ================================= */

    const {
        cartSection,
        setCartSection
    } = useCart();


    const handleCartSectionClose = () => {
        setCartSection(false);
    };


    /* ================================
       QUICK VIEW CLOSE
    ================================= */

    const handleQuickViewClose = () => {
        setQuickView(false);
    };


    /* ================================
       PRODUCT INFO MODAL
    ================================= */

    const [salePrice, setSalePrice] = useState("");
    const [regPrice, setRegPrice] = useState("");
    const [isInfoOpen, setIsInfoOpen] = useState(false);


    const handleOpennfoModal = (
        salePrice,
        regPrice
    ) => {

        setIsInfoOpen(true);

        setSalePrice(salePrice);

        setRegPrice(regPrice);
    };


    const handleCloseInfoModal = () => {

        setIsInfoOpen(false);

        setSalePrice('');

        setRegPrice('');
    };


    /* ================================
       CATEGORY
    ================================= */

    const pathname = usePathname();

    const splitedPath =
        pathname.split('/');

    const childSlug =
        splitedPath[
        splitedPath.length - 1
        ];


    const handleNavigateToOutlate = () => {

        router.push(
            `/outlet/${childSlug}`
        );
    };


    /* ================================
       GLOBAL CONTEXT
    ================================= */

    const {
        showDeliveryMessage,
        stores
    } = useGlobalContext();


    const salePageRef = useRef();


    /* ================================
       SALE CATEGORIES
    ================================= */

    const [saleCategories, setSaleCategories] =
        useState([]);


    const getSaleCategories = () => {

        const api =
            `${url}/api/v1/products/main-categories-from-products?categorySlug=${childSlug}`;


        return fetch(api)

            .then(response => {

                if (!response.ok) {

                    return response.json()
                        .then(err => {

                            throw new Error(
                                err.message ||
                                "Server Error"
                            );
                        });
                }


                return response.json();
            })

            .then(data => {

                setSaleCategories(
                    data.categories
                );
            })

            .catch(error => {

                console.log(
                    "UnExpected Server Error",
                    error
                );
            });
    };


    useEffect(() => {

        getSaleCategories();

    }, [childSlug]);


    /* ================================
       FILTERS
    ================================= */

    const [
        showMobileFilters,
        setShowMobileFilters
    ] = useState(false);


    const searchParams =
        useSearchParams();


    const selectedCategoryRef =
        useRef(null);


    const [allFilters, setAllFilters] =
        useState([]);


    const [priceRange, setPriceRange] =
        useState();


    const [ratingValue, setRatingValue] =
        useState([]);


    const [colorValue, setColorValue] =
        useState([]);


    const [collectionValue, setCollectionValue] =
        useState([]);


    const [brandValue, setBrandValue] =
        useState([]);


    const [isFeatured, setIsFeatured] =
        useState([]);


    const [isStock, setIsStock] =
        useState([]);


    /* ================================
       FILTER PRODUCTS
    ================================= */

    const filterProducts = async (filter) => {

        const requestId =
            ++filterRequestRef.current;


        try {

            setIsLoadingProducts(true);

            setHasNoProducts(false);

            setSortedProducts([]);


            const api =
                `/api/v1/products/by-category?categorySlug=${childSlug}&${filter}&per_page=60`;


            const response =
                await axios.get(
                    `${url}${api}`
                );


            if (
                requestId !==
                filterRequestRef.current
            ) {
                return;
            }


            const data =
                response.data.products || [];


            let finalData = data;


            if (
                selectedCategoryRef.current !==
                null
            ) {

                finalData =
                    data.filter(product =>

                        product.categories?.some(
                            category =>

                                category.is_main === 1 &&
                                category.uid ===
                                selectedCategoryRef.current
                        )
                    );
            }


            setSortedProducts(
                finalData
            );


            setHasNoProducts(
                finalData.length === 0
            );


        } catch (error) {

            if (
                requestId !==
                filterRequestRef.current
            ) {
                return;
            }


            console.error(
                "Internal Server Error",
                error
            );


            setSortedProducts([]);

            setHasNoProducts(false);


        } finally {

            if (
                requestId ===
                filterRequestRef.current
            ) {

                setIsLoadingProducts(false);
            }
        }
    };


    /* ================================
       FETCH FILTERS
    ================================= */

    const fetchFilters = async () => {

        const api =
            `/api/v1/products/by-category/filters?categorySlug=${childSlug}`;


        try {

            const response =
                await axios.get(
                    `${url}${api}`
                );


            if (
                response.status === 200
            ) {

                setAllFilters(
                    response.data
                );


                if (
                    response.data.priceRange.minPrice !==
                    undefined &&
                    response.data.priceRange.maxPrice !==
                    undefined
                ) {

                    setPriceRange([

                        response.data
                            .priceRange
                            .minPrice,

                        response.data
                            .priceRange
                            .maxPrice

                    ]);
                }

            } else {

                console.error(
                    `UnExpected ${response.status} Error`
                );
            }

        } catch (error) {

            console.error(
                "Server Error"
            );
        }
    };


    useEffect(() => {

        fetchFilters();

    }, [childSlug]);


    /* ================================
       PRICE FILTER
    ================================= */

    const handleRangeChange = (
        newRange
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        if (
            newRange[0] !==
            priceRange[0] ||
            newRange[1] !==
            priceRange[1]
        ) {

            setPriceRange(
                newRange
            );
        }


        params.set(
            "price",
            newRange.join(",")
        );


        const priceString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        router.push(
            `?${priceString}`,
            {
                scroll: false
            }
        );


        filterProducts(
            priceString
        );
    };


    /* ================================
       COLOR FILTER
    ================================= */

    const handleColorCheck = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const updatedColorValue =
            colorValue?.includes(value)
                ? []
                : [value];


        setColorValue(
            updatedColorValue
        );


        const selectedName =
            allFilters.colors[0].options

                .filter(
                    item =>
                        updatedColorValue.includes(
                            item.value
                        )
                )

                .map(
                    item =>
                        item.name
                );


        if (
            selectedName.length > 0
        ) {

            params.set(
                "color",
                selectedName.join(",")
            );

        } else {

            params.delete(
                "color"
            );
        }


        const queryString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${queryString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            queryString
        );
    };


    /* ================================
       RATING FILTER
    ================================= */

    const handleRatingFilter = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const updatedRating =
            ratingValue.includes(value)
                ? []
                : [value];


        setRatingValue(
            updatedRating
        );


        if (
            updatedRating.length > 0
        ) {

            params.set(
                "rating",
                updatedRating.join(",")
            );

        } else {

            params.delete(
                "rating"
            );
        }


        const ratingString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${ratingString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            ratingString
        );
    };


    /* ================================
       COLLECTION FILTER
    ================================= */

    const handleCollectionSelect = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const updatedCollectionValue =
            collectionValue?.includes(
                value.uid
            )
                ? []
                : [value.uid];


        setCollectionValue(
            updatedCollectionValue
        );


        if (
            updatedCollectionValue.length > 0
        ) {

            params.set(
                "collectionId",
                value.uid
            );

        } else {

            params.delete(
                "collectionId"
            );
        }


        const queryString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${queryString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            queryString
        );
    };


    /* ================================
       BRAND FILTER
    ================================= */

    const handleBrandSelect = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const updatedBrandName =
            brandValue?.includes(
                value.name
            )
                ? []
                : [value.name];


        setBrandValue(
            updatedBrandName
        );


        if (
            updatedBrandName.length > 0
        ) {

            params.set(
                "brand",
                value.name
            );

        } else {

            params.delete(
                "brand"
            );
        }


        const queryString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${queryString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            queryString
        );
    };


    /* ================================
       FEATURED FILTER
    ================================= */

    const handleFeatured = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        let updatedFeatureCodes =
            [...isFeatured];


        if (
            updatedFeatureCodes.includes(
                value.code
            )
        ) {

            updatedFeatureCodes =
                updatedFeatureCodes.filter(
                    code =>
                        code !==
                        value.code
                );


            params.delete(
                value.code
            );

        } else {

            updatedFeatureCodes.push(
                value.code
            );


            params.set(
                value.code,
                "1"
            );
        }


        setIsFeatured(
            updatedFeatureCodes
        );


        const queryString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${queryString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            queryString
        );
    };


    /* ================================
       STOCK FILTER
    ================================= */

    const handleStock = (
        value
    ) => {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const updatedStock =
            isStock?.includes(
                value.code
            )
                ? []
                : [value.code];


        setIsStock(
            updatedStock
        );


        if (
            updatedStock.length > 0
        ) {

            params.set(
                "stockStatus",
                value.code ===
                    "inStock"
                    ? 1
                    : 0
            );

        } else {

            params.delete(
                "stockStatus"
            );
        }


        const queryString =
            params
                .toString()
                .replace(
                    /%2C/g,
                    ","
                )
                .replace(
                    /\+/g,
                    " "
                );


        const pathname =
            window.location.pathname;


        router.replace(
            `${pathname}?${queryString}`,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts(
            queryString
        );
    };


    const handleCategorySelect =
        () => { };


    /* ================================
       CLEAR FILTERS
    ================================= */

    const handleClearFilters = () => {

        setPriceRange([
            priceRange[0],
            priceRange[1]
        ]);

        setColorValue([]);

        setRatingValue([]);

        setCollectionValue([]);

        setBrandValue([]);

        setIsFeatured([]);

        setIsStock([]);


        selectedCategoryRef.current =
            null;


        setHasNoProducts(false);

        setIsLoadingProducts(true);


        const pathname =
            window.location.pathname;


        router.replace(
            pathname,
            {
                shallow: true,
                scroll: false
            }
        );


        filterProducts("");
    };


    /* ================================
       PRODUCTS CONTEXT SYNC
    ================================= */

    useEffect(() => {

        if (
            !searchParams.toString()
        ) {

            if (
                products &&
                products.length > 0
            ) {

                setSortedProducts(
                    products
                );

                setHasNoProducts(
                    false
                );

                setIsLoadingProducts(
                    false
                );

            } else if (
                products &&
                products.length === 0 &&
                totalProducts === 0
            ) {

                setSortedProducts([]);

                setHasNoProducts(
                    true
                );

                setIsLoadingProducts(
                    false
                );
            }
        }

    }, [
        products,
        searchParams,
        totalProducts
    ]);


    /* ================================
       URL HYDRATION
    ================================= */

    const hasHydratedFromUrl =
        useRef(false);


    useEffect(() => {

        if (
            hasHydratedFromUrl.current
        ) {
            return;
        }


        const query =
            searchParams.toString();


        if (!query) {

            hasHydratedFromUrl.current =
                true;

            return;
        }


        const categoriesReady =
            saleCategories.length > 0;


        const filtersReady =
            allFilters &&
            Object.keys(allFilters).length >
            0;


        const categorySlugParam =
            searchParams.get(
                "category"
            );


        const colorParam =
            searchParams.get(
                "color"
            );


        const needsCategories =
            categorySlugParam &&
            !categoriesReady;


        const needsFilters =
            (
                colorParam ||
                Array.from(
                    searchParams.keys()
                ).some(
                    key =>
                        allFilters?.highlights?.some(
                            highlight =>
                                highlight.code ===
                                key
                        )
                )
            ) &&
            !filtersReady;


        if (
            needsCategories ||
            needsFilters
        ) {
            return;
        }


        /* CATEGORY */

        if (
            categorySlugParam &&
            saleCategories.length > 0
        ) {

            const matchIndex =
                saleCategories.findIndex(
                    category =>
                        category.slug ===
                        categorySlugParam
                );


            if (
                matchIndex !== -1
            ) {

                selectedCategoryRef.current =
                    saleCategories[
                        matchIndex
                    ].uid;
            }
        }


        /* PRICE */

        const priceParam =
            searchParams.get(
                "price"
            );


        if (priceParam) {

            const [min, max] =
                priceParam
                    .split(",")
                    .map(Number);


            if (
                !isNaN(min) &&
                !isNaN(max)
            ) {

                setPriceRange([
                    min,
                    max
                ]);
            }
        }


        /* COLOR */

        if (
            colorParam &&
            allFilters?.colors?.[0]?.options
        ) {

            const names =
                colorParam.split(",");


            const matchedValues =
                allFilters
                    .colors[0]
                    .options

                    .filter(
                        option =>
                            names.includes(
                                option.name
                            )
                    )

                    .map(
                        option =>
                            option.value
                    );


            if (
                matchedValues.length
            ) {

                setColorValue(
                    matchedValues
                );
            }
        }


        /* RATING */

        const ratingParam =
            searchParams.get(
                "rating"
            );


        if (ratingParam) {

            setRatingValue(
                ratingParam
                    .split(",")
                    .map(Number)
            );
        }


        /* COLLECTION */

        const collectionParam =
            searchParams.get(
                "collectionId"
            );


        if (
            collectionParam
        ) {

            setCollectionValue([
                collectionParam
            ]);
        }


        /* BRAND */

        const brandParam =
            searchParams.get(
                "brand"
            );


        if (brandParam) {

            setBrandValue([
                brandParam
            ]);
        }


        /* FEATURED */

        if (
            allFilters?.highlights?.length
        ) {

            const activeCodes =
                allFilters
                    .highlights

                    .filter(
                        highlight =>
                            searchParams.get(
                                highlight.code
                            ) === "1"
                    )

                    .map(
                        highlight =>
                            highlight.code
                    );


            if (
                activeCodes.length
            ) {

                setIsFeatured(
                    activeCodes
                );
            }
        }


        /* STOCK */

        const stockParam =
            searchParams.get(
                "stockStatus"
            );


        if (
            stockParam !== null
        ) {

            setIsStock([
                stockParam === "1"
                    ? "inStock"
                    : "outOfStock"
            ]);
        }


        /* FETCH FILTERED PRODUCTS */

        filterProducts(
            query
        );


        hasHydratedFromUrl.current =
            true;


    }, [
        allFilters,
        saleCategories,
        searchParams
    ]);


    useDisableBodyScroll(
        cartSection,
        quickViewClicked
    );


    /* ================================
       RETURN
    ================================= */

    return (
        <>
            <div
                ref={salePageRef}
                className="activeCategoryPage"
            >

                {!salesData ? (
                    <SaleSliderShimmer />
                ) : (
                    <Sliderr
                        images={
                            salesData?.data?.mainSlider || []
                        }
                    />
                )}

                <div className="section_1_ASP">

                    <div className="offer-head-and-grid-select">

                        {saleName && (
                            <h1 className="sale_page_heading">
                                {saleName} 2026
                            </h1>
                        )}

                    </div>


                    {/* ================================
                        HOTSPOTS
                    ================================= */}

                   {/* ================================
    HOTSPOTS
================================= */}

{!salesData?.data?.hotspots ? (

    <div className="sale-page-shimmer-hotspots">

        {Array.from({ length: 6 }).map((_, index) => (
            <div
                className="sale-page-shimmer-hotspot"
                key={index}
            />
        ))}

    </div>

) : (

    <div className="sale_page_hotspot_grid_section_main">

        {/* DESKTOP HOTSPOTS */}

        <div className="sale_page_hotspot_grid_section desktop">

            {salesData?.data?.hotspots?.desktop?.map(
                (item, index) => (

                    <Link
                        key={
                            item?._id ||
                            `desktop-${index}`
                        }
                        href={
                            item?.link_url ||
                            "#"
                        }
                        className="sale_hotspot_item"
                    >

                        <Image
                            src={
                                url +
                                item?.image_url
                            }
                            alt={
                                item?.alt_text ||
                                item?.title ||
                                "Sale"
                            }
                            width={1200}
                            height={800}
                        />

                    </Link>

                )
            )}

        </div>


        {/* MOBILE HOTSPOTS */}

        <div className="sale_page_hotspot_grid_section mobile">

            {salesData?.data?.hotspots?.mobile?.map(
                (item, index) => (

                    <Link
                        key={
                            item?._id ||
                            `mobile-${index}`
                        }
                        href={
                            item?.link_url ||
                            "#"
                        }
                        className="sale_hotspot_item"
                    >

                        <Image
                            src={
                                url +
                                item?.image_url
                            }
                            alt={
                                item?.alt_text ||
                                item?.title ||
                                "Sale"
                            }
                            width={640}
                            height={800}
                        />

                    </Link>

                )
            )}

        </div>

    </div>

)}
                </div>


                {/* ================================
                    MAIN BANNER
                ================================= */}

                {salesData?.data?.banner1 && (

                    <div className="sale_main_banner">

                        <Link
                            href={
                                salesData
                                    ?.data
                                    ?.banner1
                                    ?.desktop[0]
                                    .link_url
                            }
                        >

                            <picture>

                                <source
                                    media="(max-width: 767px)"
                                    srcSet={
                                        url +
                                        salesData
                                            ?.data
                                            ?.banner1
                                            ?.mobile[0]
                                            .image_url
                                    }
                                />


                                <Image
                                    src={
                                        url +
                                        salesData
                                            ?.data
                                            ?.banner1
                                            ?.desktop[0]
                                            .image_url
                                    }
                                    alt="Labor Day Sale"
                                    width={1920}
                                    height={600}
                                    priority
                                    className="sale_main_banner_image"
                                />

                            </picture>

                        </Link>

                    </div>
                )}


                {/* ================================
                    PRODUCTS + SHIMMER
                ================================= */}

                {isLoadingProducts ? (

                    <div className="toppedProductsSection">

                        <SalePageShimmer
                            count={6}
                        />

                    </div>

                ) : salesData?.data?.topProducts && (

                    <div className="toppedProductsSection">

                        <div className="toppedProductsSection_products">

                            {
                            salesData
                                ?.data
                                ?.topProducts
                                .map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <ProductCardLifeStyle

                                            key={
                                                item._id ||
                                                index
                                            }

                                            slug={
                                                item.slug
                                            }

                                            singleProductData={
                                                item
                                            }

                                            maxWidthAccordingToComp="100%"

                                            justWidth="100%"

                                            colTwo={
                                                activeGrid ===
                                                    "single-col"
                                                    ? false
                                                    : true
                                            }

                                            tagIcon={
                                                item.productTag
                                                    ? item.productTag
                                                    : heart
                                            }

                                            tagClass={
                                                item.productTag
                                                    ? "tag-img"
                                                    : "heart-icon"
                                            }

                                            mainImage={
                                                item
                                                    .images[0]
                                                    .image_url
                                            }

                                            productCardContainerClass="product-card"

                                            ProductSku={
                                                item.sku
                                            }

                                            tags={
                                                item.sale_tag
                                            }

                                            ProductTitle={
                                                item.name
                                            }

                                            reviewCount={
                                                item.reviewCount
                                            }

                                            lowPriceAddvertisement={
                                                item.lowPriceAddvertisement
                                            }

                                            priceTag={
                                                item.regular_price
                                            }

                                            sale_price={
                                                item.sale_price
                                            }

                                            financingAdd={
                                                item.financingAdd
                                            }

                                            learnMore={
                                                item.learnMore
                                            }

                                            mainIndex={
                                                index
                                            }

                                            deliveryTime={
                                                item.deliveryTime
                                            }

                                            stock={
                                                item.manage_stock
                                            }

                                            attributes={
                                                item.attributes
                                            }

                                            handleCardClick={() =>
                                                handleProductClick(
                                                    item
                                                )
                                            }

                                            handleQuickView={() =>
                                                handleQuickViewOpen(
                                                    item
                                                )
                                            }

                                            handleWishListclick={() =>
                                                handleWishList(
                                                    item
                                                )
                                            }

                                            showOnPage={
                                                true
                                            }

                                            createdDate={
                                                item.createdAt
                                            }

                                            showExtraLines={
                                                true
                                            }

                                            titleHeight={
                                                false
                                            }

                                            allow_back_order={
                                                item.allow_back_order
                                            }

                                            handleInfoModal={() =>
                                                handleOpennfoModal(
                                                    item.sale_price,
                                                    item.regular_price
                                                )
                                            }

                                            productTag={
                                                item.product_tag
                                            }

                                        />

                                    )
                                )}

                        </div>


                        <div className="active-sale-view-more-button-contianer">

                            <button
                                className="active-sale-view-more-button"
                                onClick={
                                    handleNavigateToOutlate
                                }
                            >
                                View More Products
                            </button>

                        </div>

                    </div>
                )}


                {/* ================================
                    CONTENT
                ================================= */}

                <div className="content_1_section">

                    <div className="left_side_cont">

                        <div
                            dangerouslySetInnerHTML={{
                                __html:
                                    salesData
                                        ?.data
                                        ?.content1 ||
                                    ""
                            }}
                        />

                    </div>


                    <div className="right_side_cont">

                        {salesData && (

                            <img
                                src={
                                    url +
                                    salesData
                                        ?.data
                                        ?.banner2[0]
                                        ?.image_url
                                }
                                alt="img"
                            />

                        )}

                    </div>

                </div>


                <Sliderr
                    height="auto"
                    images={
                        salesData
                            ? salesData
                                ?.data
                                ?.banner3
                            : []
                    }
                />


                {/* ================================
                    SHOWROOMS
                ================================= */}

                {stores?.length > 0 && (

                    <div className="stores_details_bottom">

                        <h1 className="sale_page_heading">
                            Our Showrooms
                        </h1>


                        <div className="stores_details_grid">

                            {stores.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <ShowRoomContainer
                                        key={
                                            item?._id ||
                                            index
                                        }
                                        data={
                                            item
                                        }
                                    />

                                )
                            )}

                        </div>

                    </div>
                )}


                {/* ================================
                    MODALS / CART
                ================================= */}

                <QuickView
                    setQuickViewProduct={
                        quickViewProduct
                    }
                    quickViewShow={
                        quickViewClicked
                    }
                    quickViewClose={
                        handleQuickViewClose
                    }
                />


                <SideCart
                    isCartOpen={
                        cartSection
                    }
                    handleCloseSideCart={
                        handleCartSectionClose
                    }
                />


                <SnakBar
                    message={
                        snakeBarMessage
                    }
                    openSnakeBarProp={
                        showSnakeBar
                    }
                    setOpenSnakeBar={
                        setShowSnakeBar
                    }
                    onClick={
                        handleCloseSnakeBar
                    }
                />


                <ProductInfoModal
                    openModal={
                        isInfoOpen
                    }
                    closeModal={
                        handleCloseInfoModal
                    }
                    salePrice={
                        salePrice
                    }
                    regPrice={
                        regPrice
                    }
                />


                {showDeliveryMessage && (

                    <DisableDelivery
                        parentRef={
                            salePageRef
                        }
                    />

                )}


                <MobileViewProductFilters

                    showMobileFilters={
                        showMobileFilters
                    }

                    setMobileFilters={
                        setShowMobileFilters
                    }

                    filtersData={
                        allFilters
                    }

                    subCategorySlug={
                        childSlug
                    }

                    priceRange={
                        priceRange
                    }

                    tempRange={
                        priceRange
                    }

                    setTampRange={
                        setPriceRange
                    }

                    setPriceRange={
                        setPriceRange
                    }

                    colorValue={
                        colorValue
                    }

                    setColorValue={
                        setColorValue
                    }

                    ratingValue={
                        ratingValue
                    }

                    collectionValue={
                        collectionValue
                    }

                    brandValue={
                        brandValue
                    }

                    isFeatured={
                        isFeatured
                    }

                    isStock={
                        isStock
                    }

                    handleColor={
                        handleColorCheck
                    }

                    handleRating={
                        handleRatingFilter
                    }

                    handleCategory={
                        handleCategorySelect
                    }

                    handlePriceRange={
                        handleRangeChange
                    }

                    handleCollectionSelect={
                        handleCollectionSelect
                    }

                    handleBrandSelect={
                        handleBrandSelect
                    }

                    handleFeatured={
                        handleFeatured
                    }

                    handleStock={
                        handleStock
                    }

                    clearFilters={
                        handleClearFilters
                    }

                />

            </div>
        </>
    );
}