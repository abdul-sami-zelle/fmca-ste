'use client'

import React, { useState, useEffect, useRef } from "react";
import "./ActiveCategoryPage.css"
import '../Products/Products.css'
import { url, useDisableBodyScroll } from "../../../utils/api";
import { useActiveSalePage } from "../../../context/ActiveSalePageContext/ActiveSalePageContext";
import Sliderr from "../../../Global-Components/Slider/Slider";
// import { useNavigate } from "react-router-dom";
import { useList } from "../../../context/wishListContext/wishListContext";
import ProductCardShimmer from "../../Components/Loaders/productCardShimmer/productCardShimmer";
import heart from "../../../Assets/icons/heart-vector.png"
import { useCart } from "../../../context/cartContext/cartContext";
import QuickView from "../../Components/QuickView/QuickView";
import ProductCardTwo from "../../Components/ProductCardTwo/ProductCardTwo";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import SnakBar from "@/Global-Components/SnakeBar/SnakBar";
import ProductInfoModal from "@/Global-Components/ProductInfoModal/ProductInfoModal";
import SideCart from "../Cart-side-section/SideCart";
import { useGlobalContext } from "@/context/GlobalContext/globalContext";
import DisableDelivery from "@/Global-Components/DisableDelivery/DisableDelivery";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { CiCircleList } from "react-icons/ci";
import DoubleRangeSlider from "@/Global-Components/MultiRangeBar/MultiRange";
import { FaMinus, FaPlus } from "react-icons/fa";
import RatingReview from "../starRating/starRating";
import MobileViewProductFilters from "../MobileViewProductFilters/MobileViewProductFilters";

export default function SaleClient({ slug }) {
    const router = useRouter();
    const { salesData, products, totalProducts, noProducts, setNoProducts } = useActiveSalePage();
    const [sortedProducts, setSortedProducts] = useState([])
    useEffect(() => { setSortedProducts(products) }, [products])

    const handleProductClick = (item) => {
        router.push(`/product/${item.slug}`)
    };

    const [quickViewProduct, setQuickViewProduct] = useState({})
    const [quickViewClicked, setQuickView] = useState(false);
    const [addToCartClicked, setAddToCartClicked] = useState(false)
    const [activeGrid, setActiveGrid] = useState('single-col')

    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item)

    }
    // wish list 
    const { addToList, removeFromList, isInWishList } = useList()
    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState();

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

    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

    const {
        cartProducts,
        increamentQuantity,
        decreamentQuantity,
        removeFromCart,
        cartSection,
        setCartSection
    } = useCart();

    const handleCartSectionClose = () => {
        setCartSection(false)
    }
    const handleQuickViewClose = () => { setQuickView(false) }

    const [salePrice, setSalePrice] = useState("");
    const [regPrice, setRegPrice] = useState("");
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const handleOpennfoModal = (salePrice, regPrice) => {
        setIsInfoOpen(true);
        setSalePrice(salePrice)
        setRegPrice(regPrice)
    }

    const handleCloseInfoModal = () => {
        setIsInfoOpen(false);
        setSalePrice('');
        setRegPrice('')
    }

    const pathname = usePathname();
    const splitedPath = pathname.split('/')
    const childSlug = splitedPath[splitedPath.length - 1];
    const handleNavigateToOutlate = () => {
        router.push(`/outlet/${childSlug}`)
    }

    const handleActiveGrid = (grid) => {
        setActiveGrid(grid)
    }

    const { showDeliveryMessage } = useGlobalContext();
    const salePageRef = useRef()

    const [showButtons, setShowButtons] = useState(true)
    const [saleCategories, setSaleCategories] = useState([])
    const [selectedSaleCategory, setSelectedSaleCategory] = useState('')
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(true);
    const scrollRef = useRef()
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);
    const [showArrows, setShowArrows] = useState(false)
    const [activeCategory, setActiveCategory] = useState(null)

    const getSaleCategories = () => {
        const api = `${url}/api/v1/products/main-categories-from-products?categorySlug=${childSlug}`;
        return fetch(api).then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || "Server Error")
                })
            }
            return response.json()
        }).then(data => {
            setSaleCategories(data.categories)
        }).catch(error => console.log("UnExpected Server Error", error))
    }

    useEffect(() => {
        getSaleCategories()
    }, [])
    useEffect(() => {
        getSaleCategories()
    }, [childSlug, selectedSaleCategory])

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;

        const isOverflowing = el.scrollWidth > el.clientWidth + 1;

        if (!isOverflowing) {
            setShowArrows(false);
            setAtStart(true);
            setAtEnd(true);
            return;
        }

        setShowArrows(true);

        setAtStart(el.scrollLeft <= 0);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftStart(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || e.buttons !== 1) return; // Only drag if mouse is down
        e.preventDefault();

        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeftStart - walk;

        handleScroll();
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, [isDragging, startX, scrollLeftStart]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Run scroll check
        const runCheck = () => {
            const isOverflowing = el.scrollWidth > el.clientWidth + 1;
            if (!isOverflowing) {
                setShowArrows(false);
                setAtStart(true);
                setAtEnd(true);
                return;
            }
            setShowArrows(true);
            setAtStart(el.scrollLeft <= 0);
            setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
        };

        // Listen to events
        el.addEventListener("scroll", runCheck);
        window.addEventListener("resize", runCheck);

        // Also check when images load
        const imgs = el.querySelectorAll("img");
        let loadedCount = 0;
        imgs.forEach((img) => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener("load", () => {
                    loadedCount++;
                    if (loadedCount === imgs.length) {
                        runCheck();
                    }
                });
            }
        });

        // Initial check after paint
        requestAnimationFrame(runCheck);

        return () => {
            el.removeEventListener("scroll", runCheck);
            window.removeEventListener("resize", runCheck);
        };
    }, [saleCategories]);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
    };

    const [showFilters, setShowFilters] = useState(true)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null)
    const searchParams = useSearchParams()
    const selectedCategoryRef = useRef(null);

    // const handleFilterProduct = (item, index) => {
    //     const newActiveIndex = activeCategory === index ? null : index;
    //     const newCategoryId = selectedCategoryId === item.uid ? null : item.uid;

    //     setActiveCategory(newActiveIndex);
    //     setSelectedCategoryId(newCategoryId);

    //     setSortedProducts([]);

    //     setTimeout(() => {
    //         // 👉 If category is removed (null) → show all products
    //         if (newCategoryId === null && searchParams.toString === '') {
    //             setSortedProducts(products);
    //             return;
    //         } else if(searchParams.toString() !== null) {
    //             filterProducts(searchParams.toString())
    //             return;
    //         }

    //         // 👉 Otherwise filter based on selected category
    //         const filtered = products.filter((product) =>
    //             product.categories.some(
    //                 (category) => category.is_main === 1 && category.uid === newCategoryId
    //             )
    //         );

    //         if(searchParams.toString() !== '') {
    //             filterProducts(searchParams.toString())
    //         } else {
    //             setSortedProducts(filtered);
    //         }

    //     }, 1000);
    // };


    const handleFilterProduct = (item, index) => {
        const newActiveIndex = activeCategory === index ? null : index;
        const newCategoryId = selectedCategoryId === item.uid ? null : item.uid;

        setActiveCategory(newActiveIndex);
        setSelectedCategoryId(newCategoryId);

        // 👉 NEW: update ref immediately so filterProducts always sees latest value
        selectedCategoryRef.current = newCategoryId;

        const query = searchParams.toString(); // always call once
        const isQueryEmpty = query === "";

        setSortedProducts([]);

        setTimeout(() => {

            // 1️⃣ NO category selected + NO search params  → show all products
            if (newCategoryId === null && isQueryEmpty) {
                setSortedProducts(products);
                return;
            }

            // 2️⃣ NO category selected + search params NOT empty → show filtered API data
            if (newCategoryId === null && !isQueryEmpty) {
                filterProducts(query);
                return;
            }

            // 3️⃣ Category selected + NO search params → filter by category only
            if (newCategoryId !== null && isQueryEmpty) {
                const filtered = products.filter(product =>
                    product.categories.some(
                        category =>
                            category.is_main === 1 &&
                            category.uid === newCategoryId
                    )
                );
                setSortedProducts(filtered);
                return;
            }

            // 4️⃣ Category selected + search params NOT empty → filtered API data + category filter
            if (newCategoryId !== null && !isQueryEmpty) {
                filterProducts(query);
                return;
            }

        }, 500);
    };


    const [allFilters, setAllFilters] = useState([])
    const [priceRange, setPriceRange] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false);
    const [collectionOpen, setCollectionOpen] = useState("");
    const [brandOpen, setBrandOpen] = useState("");
    const [highlightOpen, setHighlightOpen] = useState("");
    const [stockOpen, setStockOpen] = useState("");
    const [ratingValue, setRatingValue] = useState([]);
    const [colorValue, setColorValue] = useState([])
    const [collectionValue, setCollectionValue] = useState([])
    const [brandValue, setBrandValue] = useState([])
    const [isFeatured, setIsFeatured] = useState([])
    const [isStock, setIsStock] = useState([])
    const [clearFilters, setClearFilters] = useState(false)
    

    const filterProducts = async (filter) => {
        const api = `/api/v1/products/by-category?categorySlug=${childSlug}&${filter}&per_page=60`;
        try {
            setSortedProducts([])
            setClearFilters(true);
            const response = await axios.get(`${url}${api}`);
            let data = response.data.products;
            
            let finalData = data;

            if (selectedCategoryRef.current !== null) {
                finalData = data.filter(product =>
                    product.categories.some(category =>
                        category.is_main === 1 &&
                        category.uid === selectedCategoryRef.current
                    )
                );
            }

            setNoProducts(finalData.length === 0)

            setSortedProducts(finalData);
        } catch (error) {
            console.error("Internal Server Error", error);
            setClearFilters(false);
        } finally {
            setClearFilters(false);
        }
    };

    const fetchFilters = async () => {
        const api = `/api/v1/products/by-category/filters?categorySlug=${childSlug}`;
        try {
            const response = await axios.get(`${url}${api}`);
            if (response.status === 200) {
                setAllFilters(response.data);
                if (
                    response.data.priceRange.minPrice !== undefined &&
                    response.data.priceRange.maxPrice !== undefined
                ) {
                    setPriceRange([
                        response.data.priceRange.minPrice,
                        response.data.priceRange.maxPrice,
                    ]);
                }
            } else {
                console.error(`UnExpected ${response.status} Error`);
            }
        } catch (error) {
            console.error("Server Error");
        }
    };

    useEffect(() => { fetchFilters() }, [])

    const handleRangeChange = (newRange) => {
        const params = new URLSearchParams(window.location.search);
        if (newRange[0] !== priceRange[0] || newRange[1] !== priceRange[1]) {
            setPriceRange(newRange);
        }

        params.set("price", newRange.join(","));

        let priceString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");

        router.push(`?${priceString}`);
        filterProducts(priceString);
    };

    const handleColorCheck = (value) => {
        const params = new URLSearchParams(window.location.search);
        const updatedColorValue = colorValue?.includes(value) ? [] : [value];

        setColorValue(updatedColorValue);

        const selectedName = allFilters.colors[0].options
            .filter((item) => updatedColorValue.includes(item.value))
            .map((item) => item.name);

        if (selectedName.length > 0) {
            params.set("color", selectedName.join(","));
        } else {
            params.delete("color");
        }



        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;



        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true });

        // ✅ Call API after updating query
        filterProducts(queryString);
    };

    const handleRatingFilter = (value) => {
        const params = new URLSearchParams(window.location.search);
        const updatedRating = ratingValue.includes(value) ? [] : [value];

        setRatingValue(updatedRating);

        if (updatedRating.length > 0) {
            params.set("rating", updatedRating.join(","));
        } else {
            params.delete("rating");
        }

        // params.set("page", 1);
        // setActivePage(1);
        // setActivePageIndex(1);

        const ratingString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");

        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${ratingString}`, { shallow: true });
        filterProducts(ratingString);
    };

    const handleCollectionSelect = (value) => {
        const params = new URLSearchParams(window.location.search);
        const updatedCollectionValue = collectionValue?.includes(value.uid)
            ? []
            : [value.uid];

        setCollectionValue(updatedCollectionValue);

        if (updatedCollectionValue.length > 0) {
            params.set("collectionId", value.uid);
        } else {
            params.delete("collectionId");
        }

        // Always reset to page 1 on filter change
        // params.set("page", "1");
        // setActivePage(1);
        // setActivePageIndex(1);

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true });

        // ✅ Call API after updating query
        filterProducts(queryString);
    };

    const handleBrandSelect = (value) => {
        const params = new URLSearchParams(window.location.search);
        const updatedBrandName = brandValue?.includes(value.name)
            ? []
            : [value.name];

        setBrandValue(updatedBrandName);

        if (updatedBrandName.length > 0) {
            params.set("brand", value.name);
        } else {
            params.delete("brand");
        }

        // Always reset to page 1 on filter change
        // params.set("page", "1");
        // setActivePage(1);
        // setActivePageIndex(1);

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true });

        // ✅ Call API after updating query
        filterProducts(queryString);
    };

    const handleFeatured = (value) => {
        const params = new URLSearchParams(window.location.search);

        // Clone current isFeatured array
        let updatedFeatureCodes = [...isFeatured];

        // ✅ Remove or add feature from isFeatured state
        if (updatedFeatureCodes.includes(value.code)) {
            // If already selected, remove it
            updatedFeatureCodes = updatedFeatureCodes.filter(
                (code) => code !== value.code
            );
            params.delete(value.code);
        } else {
            // If not selected, add it
            updatedFeatureCodes.push(value.code);
            params.set(value.code, "1");
        }

        // 🔄 Update state with all selected feature codes
        setIsFeatured(updatedFeatureCodes);

        // Always reset to page 1 on filter change
        // params.set("page", "1");
        // setActivePage(1);
        // setActivePageIndex(1);

        // Clean query string
        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true });

        // ✅ Call API with updated query
        filterProducts(queryString);
    };

    const handleStock = (value) => {
        const params = new URLSearchParams(window.location.search);
        const updatedStock = isStock?.includes(value.code) ? [] : [value.code];

        setIsStock(updatedStock);

        if (updatedStock.length > 0) {
            params.set("stockStatus", value.code === "inStock" ? 1 : 0);
        } else {
            params.delete("stockStatus");
        }

        // Always reset to page 1 on filter change
        // params.set("page", "1");
        // setActivePage(1);
        // setActivePageIndex(1);

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true });

        // ✅ Call API after updating query
        filterProducts(queryString);
    };

    const handleCategorySelect = (value) => { };

    const handleColorFilterOpenClose = (type) => {
        setIsOpen((prevOpen) => (prevOpen === type ? "" : type));
        setRatingOpen((prevOpen) => (prevOpen === type ? "" : type));
        setCollectionOpen((prevOpen) => (prevOpen === type ? "" : type));
        setBrandOpen((prevOpen) => (prevOpen === type ? "" : type));
        setHighlightOpen((prevOpen) => (prevOpen === type ? "" : type));
        setStockOpen((prevOpen) => (prevOpen === type ? "" : type));
    };

    const handleClearFilters = () => {
        setPriceRange([priceRange[0], priceRange[1]]);
        setColorValue([]);
        setRatingValue([]);
        setCollectionValue([]);
        setBrandValue([]);
        setIsFeatured([]);
        setIsStock([]);
        setSortedProducts(products)

        const pathname = window.location.pathname;
        router.replace(pathname, { shallow: true });

        fetchFilters();
        filterProducts("");
    };

    useDisableBodyScroll(cartSection, quickViewClicked)

    return (
        <>
            <div ref={salePageRef} className="activeCategoryPage">
                {salesData && <Sliderr images={salesData?.data?.mainSlider} />}

                <div className="section_1_ASP">
                    <div className="offer-head-and-grid-select">
                        {/* <h3 className='category-heading'>{salesData ? salesData?.data?.categoryData?.name : ""}</h3> */}

                        <div className="offer-grid-main-container">
                            <div className={`offer-single-col-outer-container ${activeGrid === 'single-col' ? 'active-offer-single-col' : ''}`} onClick={() => handleActiveGrid('single-col')}>
                                <div className={`offer-single-col-inner-container ${activeGrid === 'single-col' ? 'active-single-inner-col' : ''}`}></div>
                            </div>
                            <div className={`offer-dual-col-outer-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-outer' : ''}`}>
                                <div className={`offer-dual-col-grid-container`} onClick={() => handleActiveGrid('dual-col')}>
                                    <div className={`offer-dual-col-inner-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-inner' : ''}`}></div>
                                    <div className={`offer-dual-col-inner-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-inner' : ''}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {products && products?.length > 0 && (
                        <div className="offer-head-categories-images-container">
                            {showButtons && (
                                <button
                                    className='offer-head-categories-scroll-button offer-head-left'
                                    style={{ visibility: atStart ? 'hidden' : 'visible' }}
                                    onClick={() => scrollLeft()}
                                >
                                    <IoIosArrowBack size={15} color='var(--orange-outline)' />
                                </button>
                            )}
                            <div
                                ref={scrollRef}
                                className="offer-head-categories-images-slider-container"
                                onMouseDown={handleMouseDown}
                            >
                                {saleCategories.map((item, index) => (
                                    <div key={index} onClick={() => handleFilterProduct(item, index)} className={`offer-category-image-single-item-container ${activeCategory === index ? 'active-selected-category' : ''}`}>
                                        {item?.filterImage && <Image src={url + item?.filterImage} width={90} height={90} alt="image" />}
                                    </div>
                                ))}
                            </div>

                            {showButtons && (
                                <button
                                    onClick={() => scrollRight()}
                                    className='offer-head-categories-scroll-button offer-head-right'
                                    style={{ visibility: atEnd ? 'hidden' : 'visible' }}
                                >
                                    <IoIosArrowForward size={15} color='var(--orange-outline)' />
                                </button>
                            )}
                        </div>
                    )}
                    {noProducts ? (
                        <div className="product-not-found-container">
                            <Image
                                src={"/Assets/icon/product-empty.png"}
                                width={120}
                                height={120}
                                alt="no found"
                            />
                            <h3>No Products Found</h3>
                            <p>Your search did not match any product.</p>
                            <button className="no-product-clear-filter-button" onClick={handleClearFilters}>Clear Filters</button>

                        </div>
                    ) : (
                        <div className="sale-page-filter-and-products-main-container">

                            <div className={`sale-page-filter-contain-container ${showFilters ? 'show-filter-section' : ''}`}>

                                <div className="filter-section-hide-button-container">
                                    <button onClick={() => setShowFilters(false)}>
                                        <BsArrowLeft size={15} color="#000" /> Hide Filters
                                    </button>
                                </div>

                                <div className="filter-section-heading-and-clear-filter-button">
                                    <h3>Filters</h3>
                                    <button onClick={handleClearFilters}>
                                        Clear Filters
                                    </button>
                                </div>

                                <div className="all-filters-section">
                                    {/* Price Filter */}

                                    {allFilters?.priceRange?.minPrice !== undefined &&
                                        allFilters?.priceRange?.maxPrice !== undefined &&
                                        priceRange && (

                                            <DoubleRangeSlider
                                                min={allFilters?.priceRange?.minPrice}
                                                max={allFilters?.priceRange?.maxPrice}
                                                initialRange={priceRange}
                                                setInitialRange={setPriceRange}
                                                onRangeChange={handleRangeChange}
                                                minLabel="Min Price:"
                                                maxLabel="Max Price:"
                                            />
                                        )}

                                    {/* Color Filter */}
                                    <div className="single-filter">
                                        <span
                                            onClick={() => handleColorFilterOpenClose("color-filter")}
                                        >
                                            <h3 className="filters-heading">
                                                {allFilters?.colors?.[0]?.name}
                                            </h3>
                                            <i className="add-button-round">
                                                {isOpen === "color-filter" ? (
                                                    <FaMinus ize={14} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={14} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${isOpen === "color-filter"
                                                ? "show-single-filter-icons"
                                                : ""
                                                }`}
                                        >
                                            {allFilters?.colors?.[0]?.options.map((item, index) => (
                                                <span key={index} className={`color-span`}>
                                                    <input
                                                        type="checkbox"
                                                        name="colorFilter"
                                                        value={item.name}
                                                        checked={colorValue?.includes(item.value)}
                                                        onChange={(e) =>
                                                            handleColorCheck(item.value, item.name)
                                                        }
                                                        style={{
                                                            backgroundColor: item.value,
                                                            border: `2px solid ${item.value}`,
                                                        }}
                                                        className="color-custom-checkbox"
                                                        id={`color-filter-${index}`}
                                                    />
                                                    <label
                                                        className="filter-inner-text"
                                                        htmlFor={`filter-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Featured Filter */}
                                    <div className="single-filter">
                                        <span
                                            onClick={() => handleColorFilterOpenClose("highlight")}
                                        >
                                            <h3 className="filters-heading">Trending</h3>
                                            <i className="add-button-round">
                                                {highlightOpen === "highlight" ? (
                                                    <FaMinus ize={14} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={14} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${highlightOpen === "highlight"
                                                ? "show-single-filter-icons"
                                                : ""
                                                }`}
                                        >
                                            {allFilters?.highlights?.map((item, index) => (
                                                <span key={index} className={`color-span`}>
                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.code}
                                                        checked={isFeatured?.includes(item.code)}
                                                        onChange={(e) => handleFeatured(item)}
                                                        className="custom-checkbox"
                                                        id={`feature-${index}`}
                                                    />
                                                    <label
                                                        className="filter-inner-text"
                                                        htmlFor={`feature-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Collections Filter */}
                                    <div className="single-filter">
                                        <span
                                            onClick={() => handleColorFilterOpenClose("collections")}
                                        >
                                            <h3 className="filters-heading">Collection</h3>
                                            <i className="add-button-round">
                                                {collectionOpen === "collections" ? (
                                                    <FaMinus ize={14} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={14} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${collectionOpen === "collections"
                                                ? "show-single-filter-icons"
                                                : ""
                                                }`}
                                        >
                                            {allFilters?.collections?.map((item, index) => (
                                                <span key={index} className={`color-span`}>
                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.uid}
                                                        checked={collectionValue?.includes(item.uid)}
                                                        onChange={(e) => handleCollectionSelect(item)}
                                                        className="custom-checkbox"
                                                        id={`collection-${index}`}
                                                    />
                                                    <label
                                                        className="filter-inner-text"
                                                        htmlFor={`collection-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Brand Filter */}
                                    <div className="single-filter">
                                        <span onClick={() => handleColorFilterOpenClose("brand")}>
                                            <h3 className="filters-heading">Brand</h3>
                                            <i className="add-button-round">
                                                {brandOpen === "brand" ? (
                                                    <FaMinus ize={14} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={14} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${brandOpen === "brand" ? "show-single-filter-icons" : ""
                                                }`}
                                        >
                                            {allFilters?.brands?.map((item, index) => (
                                                <span key={index} className={`color-span`}>
                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.name}
                                                        checked={brandValue?.includes(item.name)}
                                                        onChange={(e) => handleBrandSelect(item)}
                                                        className="custom-checkbox"
                                                        id={`brand-${index}`}
                                                    />
                                                    <label
                                                        className="filter-inner-text"
                                                        htmlFor={`brand-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rating Filter */}
                                    <div className="single-filter">
                                        <span
                                            onClick={() =>
                                                handleColorFilterOpenClose("rating-filter")
                                            }
                                        >
                                            <h3 className="filters-heading">Ratings</h3>
                                            <i className="add-button-round">
                                                {isOpen === "rating-filter" ? (
                                                    <FaMinus ize={15} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={15} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${ratingOpen === "rating-filter"
                                                ? "show-single-filter-icons"
                                                : ""
                                                }`}
                                        >
                                            {[...Array(5).keys()].reverse().map((item, index) => {
                                                const rating = item + 1;
                                                return (
                                                    <span key={index} className={`color-span`}>
                                                        <input
                                                            type="checkbox"
                                                            placeholder="checkbox"
                                                            value={rating}
                                                            checked={ratingValue.includes(rating)}
                                                            onChange={(e) =>
                                                                handleRatingFilter(Number(e.target.value))
                                                            }
                                                            className="custom-checkbox"
                                                            id={`rating-${rating}`}
                                                        />
                                                        <label htmlFor={`rating-${5 - item}`}>
                                                            <RatingReview
                                                                rating={item + 1}
                                                                disabled={true}
                                                                size={"20px"}
                                                            />
                                                        </label>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Stock Filter */}
                                    <div className="single-filter">
                                        <span onClick={() => handleColorFilterOpenClose("stock")}>
                                            <h3 className="filters-heading">Stock Status</h3>
                                            <i className="add-button-round">
                                                {stockOpen === "stock" ? (
                                                    <FaMinus ize={14} color="var(--secondary-color)" />
                                                ) : (
                                                    <FaPlus ize={14} color="var(--secondary-color)" />
                                                )}
                                            </i>
                                        </span>
                                        <div
                                            className={`single-filter-items-container ${stockOpen === "stock" ? "show-single-filter-icons" : ""
                                                }`}
                                        >
                                            {allFilters?.stock?.map((item, index) => (
                                                <span key={index} className={`color-span`}>
                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.code}
                                                        checked={isStock?.includes(item.code)}
                                                        onChange={(e) => handleStock(item)}
                                                        className="custom-checkbox"
                                                        id={`stock-${index}`}
                                                    />
                                                    <label
                                                        className="filter-inner-text"
                                                        htmlFor={`stock-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className={`sale-page-products-contain-container ${showFilters ? 'decrease-products-section' : ''}`}>

                                <div className="sale-products-len-and-show-filter-button-section">
                                    {!showFilters && (
                                        <button className="sale-product-show-filter-button" onClick={() => setShowFilters(true)}>
                                            <CiCircleList size={15} color="#000" /> Show Filters
                                        </button>
                                    )}
                                    <button className="mobile-sale-product-show-filter-button" onClick={() => setShowMobileFilters(true)}>
                                        <CiCircleList size={15} color="#000" /> Show Filters
                                    </button>
                                    <h3 className="sale-products-total-len">{sortedProducts?.length > 0 ? sortedProducts?.length : ''} {sortedProducts?.length > 0 ? 'Products Found' : 'No Products Found'} </h3>
                                </div>

                                <div className={`active-sale-cards ${showFilters ? 'grid-col-3' : ''}  increase-columns ${activeGrid === 'single-col' ? 'offer-cards-single-grid' : 'offer-cards-dual-col'}`}>

                                    {sortedProducts && sortedProducts.length > 0 ? (
                                        sortedProducts.map((item, index) => {
                                            return <ProductCardTwo
                                                key={index}
                                                slug={item.slug}
                                                singleProductData={item}
                                                maxWidthAccordingToComp={"100%"}
                                                justWidth={'100%'}
                                                colTwo={activeGrid === 'single-col' ? false : true}
                                                tagIcon={item.productTag ? item.productTag : heart}
                                                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                                                mainImage={`${item.image.image_url}`}
                                                productCardContainerClass="product-card"
                                                ProductSku={item.sku}
                                                tags={item.sale_tag}
                                                ProductTitle={item.name}
                                                reviewCount={item.reviewCount}
                                                lowPriceAddvertisement={item.lowPriceAddvertisement}
                                                priceTag={item.regular_price}
                                                sale_price={item.sale_price}
                                                financingAdd={item.financingAdd}
                                                learnMore={item.learnMore}
                                                mainIndex={index}
                                                deliveryTime={item.deliveryTime}
                                                stock={item.manage_stock}
                                                attributes={item.attributes}
                                                handleCardClick={() => handleProductClick(item)}
                                                handleQuickView={() => handleQuickViewOpen(item)}
                                                handleWishListclick={() => handleWishList(item)}
                                                showOnPage={true}
                                                createdDate={item.createdAt}
                                                showExtraLines={true}
                                                titleHeight={true}
                                                allow_back_order={item?.allow_back_order}
                                                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                                                productTag={item.product_tag}
                                            />
                                        })
                                    ) : (
                                        Array.from({ length: 12 }).map((_, index) => (
                                            <ProductCardShimmer key={index} width={'100%'} />
                                        ))
                                    )}

                                </div>

                                {totalProducts > 16 && (
                                    <div className="active-sale-view-more-button-contianer">
                                        <button className="active-sale-view-more-button" onClick={handleNavigateToOutlate}>View More Products</button>
                                    </div>
                                )}

                            </div>

                        </div>
                    )}


                </div>

                <div className="banner-1-content">
                    <img src={`${url}${salesData?.data?.banner1?.desktop?.[0]?.image_url}`} alt="img" />
                </div>

                <div className="content_1_section">
                    <div className="left_side_cont">
                        <div dangerouslySetInnerHTML={{ __html: salesData?.data?.content1 || "" }} />
                    </div>
                    <div className="right_side_cont">
                        {salesData && (<img src={url + salesData?.data?.banner2[0]?.image_url} alt="img" />)}
                    </div>
                </div>

                <Sliderr height={"auto"} images={salesData ? salesData?.data?.banner3 : []} />
                <div className="section_3_ASP" dangerouslySetInnerHTML={{ __html: salesData?.data?.content2 || "" }} />


                <QuickView
                    setQuickViewProduct={quickViewProduct}
                    quickViewShow={quickViewClicked}
                    quickViewClose={handleQuickViewClose}
                />

                <SideCart
                    isCartOpen={cartSection}
                    handleCloseSideCart={handleCartSectionClose}
                />

                <SnakBar
                    message={snakeBarMessage}
                    openSnakeBarProp={showSnakeBar}
                    setOpenSnakeBar={setShowSnakeBar}
                    onClick={handleCloseSnakeBar}
                />

                <ProductInfoModal
                    openModal={isInfoOpen}
                    closeModal={handleCloseInfoModal}
                    salePrice={salePrice}
                    regPrice={regPrice}
                />

                {showDeliveryMessage && (
                    <DisableDelivery parentRef={salePageRef} />
                )}

                <MobileViewProductFilters
                    showMobileFilters={showMobileFilters}
                    setMobileFilters={setShowMobileFilters}
                    filtersData={allFilters}
                    subCategorySlug={childSlug}
                    priceRange={priceRange}
                    tempRange={priceRange}
                    setTampRange={setPriceRange}
                    setPriceRange={setPriceRange}
                    colorValue={colorValue}
                    setColorValue={setColorValue}
                    ratingValue={ratingValue}
                    collectionValue={collectionValue}
                    brandValue={brandValue}
                    isFeatured={isFeatured}
                    isStock={isStock}
                    handleColor={handleColorCheck}
                    handleRating={handleRatingFilter}
                    handleCategory={handleCategorySelect}
                    handlePriceRange={handleRangeChange}
                    handleCollectionSelect={handleCollectionSelect}
                    handleBrandSelect={handleBrandSelect}
                    handleFeatured={handleFeatured}
                    handleStock={handleStock}
                    clearFilters={handleClearFilters}
                />

            </div>
        </>
    )
}