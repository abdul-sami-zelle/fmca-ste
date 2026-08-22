'use client'

import React, { useState, useEffect, useRef } from "react";
import "./ActiveCategoryPage.css"
import '../Products/Products.css'
import { url, useDisableBodyScroll } from "../../../utils/api";
import { useActiveSalePage } from "../../../context/ActiveSalePageContext/ActiveSalePageContext";
import Sliderr from "../../../Global-Components/Slider/Slider";
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

export default function SaleClient({ slug, saleName }) {
    const router = useRouter();
    const {
        salesData,
        products,
        totalProducts,
        error
    } = useActiveSalePage();

    const filterRequestRef = useRef(0);

    const [hasNoProducts, setHasNoProducts] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [sortedProducts, setSortedProducts] = useState([])

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

    const handleFilterProduct = (item, index) => {
        const isDeselecting = selectedCategoryId === item.uid;
        const newActiveIndex = isDeselecting ? null : index;
        const newCategoryId = isDeselecting ? null : item.uid;
        const newCategorySlug = isDeselecting ? null : item.slug; // <-- slug of the selected category

        setActiveCategory(newActiveIndex);
        setSelectedCategoryId(newCategoryId);

        // keep ref in sync so filterProducts always sees the latest value
        selectedCategoryRef.current = newCategoryId;

        const params = new URLSearchParams(window.location.search);

        if (newCategorySlug) {
            params.set("category", newCategorySlug);
        } else {
            params.delete("category");
        }

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");

        const pathname = window.location.pathname;

        setSortedProducts([]);

        // ✅ Update the URL so category persists on refresh/share
        router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { shallow: true, scroll: false });

        filterProducts(queryString);
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
        const requestId = ++filterRequestRef.current;

        try {
            setIsLoadingProducts(true);
            setHasNoProducts(false);
            setSortedProducts([]);

            const api =
                `/api/v1/products/by-category?categorySlug=${childSlug}&${filter}&per_page=60`;

            const response = await axios.get(`${url}${api}`);

            // Ignore old API responses
            if (requestId !== filterRequestRef.current) {
                return;
            }

            let data = response.data.products || [];

            let finalData = data;

            if (selectedCategoryRef.current !== null) {
                finalData = data.filter(product =>
                    product.categories?.some(category =>
                        category.is_main === 1 &&
                        category.uid === selectedCategoryRef.current
                    )
                );
            }

            setSortedProducts(finalData);
            setHasNoProducts(finalData.length === 0);

        } catch (error) {
            if (requestId !== filterRequestRef.current) {
                return;
            }

            console.error("Internal Server Error", error);

            setSortedProducts([]);
            setHasNoProducts(false);

        } finally {
            if (requestId === filterRequestRef.current) {
                setIsLoadingProducts(false);
            }
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

        router.push(`?${priceString}`, { scroll: false });
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
        router.replace(`${pathname}?${queryString}`, { shallow: true, scroll: false });

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

        const ratingString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");

        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${ratingString}`, { shallow: true, scroll: false });
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

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true, scroll: false });

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

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true, scroll: false });

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

        // Clean query string
        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true, scroll: false });

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

        const queryString = params
            .toString()
            .replace(/%2C/g, ",")
            .replace(/\+/g, " ");
        const pathname = window.location.pathname;

        // ✅ Update the URL
        router.replace(`${pathname}?${queryString}`, { shallow: true, scroll: false });

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

        setSelectedCategoryId(null);
        setActiveCategory(null);
        selectedCategoryRef.current = null;

        setHasNoProducts(false);
        setIsLoadingProducts(true);

        const pathname = window.location.pathname;

        router.replace(pathname, {
            shallow: true,
            scroll: false
        });

        filterProducts("");
    };

    // ─────────────────────────────────────────────────────────────
    // ✅ FIX #1: only auto-sync sortedProducts from the raw `products`
    // list when there is NO active filter/category in the URL.
    //
    // Additionally, only mark hasNoProducts / isLoadingProducts=false
    // once we actually have a settled `products` result. An empty
    // `products` array right after mount (before the context's own
    // fetch resolves) previously flipped hasNoProducts to true and
    // isLoadingProducts to false immediately — flashing "No Products
    // Found" / a 0 count before real data arrived. Now we only treat
    // it as "genuinely empty" once totalProducts also confirms 0;
    // otherwise we leave the loading state alone until real data lands.
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!searchParams.toString()) {
            if (products && products.length > 0) {
                setSortedProducts(products);
                setHasNoProducts(false);
                setIsLoadingProducts(false);
            } else if (products && products.length === 0 && totalProducts === 0) {
                // Genuinely confirmed empty — not just a transient initial state
                setSortedProducts([]);
                setHasNoProducts(true);
                setIsLoadingProducts(false);
            }
            // else: context data hasn't settled yet — keep showing the loading state
        }
    }, [products, searchParams, totalProducts]);

    // ─────────────────────────────────────────────────────────────
    // ✅ FIX #2: Hydrate filters/category from the URL on first load.
    // This must WAIT until saleCategories (and allFilters, where relevant)
    // have actually loaded before it's allowed to lock itself via
    // hasHydratedFromUrl.current = true. Otherwise, on a fresh URL load
    // like ?category=kids-room, this effect fires while
    // saleCategories is still [], silently skips setting
    // activeCategory/selectedCategoryId/selectedCategoryRef, but still
    // marks itself "done" — so those never get set correctly, even
    // though the product fetch itself succeeds.
    // ─────────────────────────────────────────────────────────────
    const hasHydratedFromUrl = useRef(false);

    useEffect(() => {
        if (hasHydratedFromUrl.current) return;

        const query = searchParams.toString();
        if (!query) {
            // nothing to hydrate — don't touch loading state, Piece A owns that
            hasHydratedFromUrl.current = true;
            return;
        }

        const categoriesReady = saleCategories.length > 0;
        const filtersReady = allFilters && Object.keys(allFilters).length > 0;

        const categorySlugParam = searchParams.get("category");
        const colorParam = searchParams.get("color");

        // Only block on categoriesReady if the URL actually needs it,
        // and only block on filtersReady if color/highlight params are present —
        // otherwise we could wait forever on data we don't even need for this URL.
        const needsCategories = categorySlugParam && !categoriesReady;
        const needsFilters =
            (colorParam ||
                Array.from(searchParams.keys()).some(
                    (k) => allFilters?.highlights?.some((h) => h.code === k)
                )) &&
            !filtersReady;

        if (needsCategories || needsFilters) {
            // Wait — effect will re-run once saleCategories/allFilters update
            return;
        }

        // --- category ---
        if (categorySlugParam && saleCategories.length > 0) {
            const matchIndex = saleCategories.findIndex(cat => cat.slug === categorySlugParam);
            if (matchIndex !== -1) {
                setActiveCategory(matchIndex);
                setSelectedCategoryId(saleCategories[matchIndex].uid);
                selectedCategoryRef.current = saleCategories[matchIndex].uid;
            }
        }

        // --- price ---
        const priceParam = searchParams.get("price");
        if (priceParam) {
            const [min, max] = priceParam.split(",").map(Number);
            if (!isNaN(min) && !isNaN(max)) setPriceRange([min, max]);
        }

        // --- color ---
        if (colorParam && allFilters?.colors?.[0]?.options) {
            const names = colorParam.split(",");
            const matchedValues = allFilters.colors[0].options
                .filter(opt => names.includes(opt.name))
                .map(opt => opt.value);
            if (matchedValues.length) setColorValue(matchedValues);
        }

        // --- rating ---
        const ratingParam = searchParams.get("rating");
        if (ratingParam) {
            setRatingValue(ratingParam.split(",").map(Number));
        }

        // --- collection ---
        const collectionParam = searchParams.get("collectionId");
        if (collectionParam) {
            setCollectionValue([collectionParam]);
        }

        // --- brand ---
        const brandParam = searchParams.get("brand");
        if (brandParam) {
            setBrandValue([brandParam]);
        }

        // --- featured / highlight flags ---
        if (allFilters?.highlights?.length) {
            const activeCodes = allFilters.highlights
                .filter(h => searchParams.get(h.code) === "1")
                .map(h => h.code);
            if (activeCodes.length) setIsFeatured(activeCodes);
        }

        // --- stock ---
        const stockParam = searchParams.get("stockStatus");
        if (stockParam !== null) {
            setIsStock([stockParam === "1" ? "inStock" : "outOfStock"]);
        }

        // --- finally, fetch products matching the full query ---
        filterProducts(query);
        hasHydratedFromUrl.current = true; // ✅ only lock once fully hydrated with real data

    }, [allFilters, saleCategories, searchParams]);

    useDisableBodyScroll(cartSection, quickViewClicked)

    return (
        <>
            <div ref={salePageRef} className="activeCategoryPage">
                {salesData && <Sliderr images={salesData?.data?.mainSlider} />}

                <div className="section_1_ASP">

                    <div className="offer-head-and-grid-select">
                        {/* <h3 className='category-heading'>{salesData ? salesData?.data?.categoryData?.name : ""}</h3> */}
                        {saleName && <h1 className="sale_page_heading">{saleName}</h1>}
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
                    <div className="sale-page-filter-and-products-main-container">

                        {/* =========================================================
        FILTER SECTION
        This section ALWAYS remains visible while products load.
    ========================================================= */}

                        <div
                            className={`sale-page-filter-contain-container ${showFilters ? 'show-filter-section' : ''
                                }`}
                        >

                            <div className="filter-section-hide-button-container">
                                <button onClick={() => setShowFilters(false)}>
                                    <BsArrowLeft size={15} color="#000" />
                                    Hide Filters
                                </button>
                            </div>


                            <div className="filter-section-heading-and-clear-filter-button">
                                <h3>Filters</h3>

                                <button onClick={handleClearFilters}>
                                    Clear Filters
                                </button>
                            </div>


                            <div className="all-filters-section">

                                {/* =================================================
                PRICE FILTER
            ================================================= */}

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
                                    )
                                }


                                {/* =================================================
                COLOR FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose("color-filter")
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            {allFilters?.colors?.[0]?.name}
                                        </h3>

                                        <i className="add-button-round">

                                            {isOpen === "color-filter" ? (

                                                <FaMinus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${isOpen === "color-filter"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {allFilters?.colors?.[0]?.options?.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="color-span"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        name="colorFilter"
                                                        value={item.name}
                                                        checked={colorValue?.includes(
                                                            item.value
                                                        )}
                                                        onChange={() =>
                                                            handleColorCheck(
                                                                item.value,
                                                                item.name
                                                            )
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
                                                        htmlFor={`color-filter-${index}`}
                                                    >
                                                        {item.name}
                                                    </label>

                                                </span>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* =================================================
                FEATURED / TRENDING FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose("highlight")
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            Trending
                                        </h3>

                                        <i className="add-button-round">

                                            {highlightOpen === "highlight" ? (

                                                <FaMinus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${highlightOpen === "highlight"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {allFilters?.highlights?.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="color-span"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.code}
                                                        checked={isFeatured?.includes(
                                                            item.code
                                                        )}
                                                        onChange={() =>
                                                            handleFeatured(item)
                                                        }
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

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* =================================================
                COLLECTION FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose("collections")
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            Collection
                                        </h3>

                                        <i className="add-button-round">

                                            {collectionOpen === "collections" ? (

                                                <FaMinus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${collectionOpen === "collections"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {allFilters?.collections?.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="color-span"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.uid}
                                                        checked={collectionValue?.includes(
                                                            item.uid
                                                        )}
                                                        onChange={() =>
                                                            handleCollectionSelect(item)
                                                        }
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

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* =================================================
                BRAND FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose("brand")
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            Brand
                                        </h3>

                                        <i className="add-button-round">

                                            {brandOpen === "brand" ? (

                                                <FaMinus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${brandOpen === "brand"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {allFilters?.brands?.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="color-span"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.name}
                                                        checked={brandValue?.includes(
                                                            item.name
                                                        )}
                                                        onChange={() =>
                                                            handleBrandSelect(item)
                                                        }
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

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* =================================================
                RATING FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose(
                                                "rating-filter"
                                            )
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            Ratings
                                        </h3>

                                        <i className="add-button-round">

                                            {isOpen === "rating-filter" ? (

                                                <FaMinus
                                                    size={15}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={15}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${ratingOpen === "rating-filter"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {[...Array(5).keys()]
                                            .reverse()
                                            .map((item, index) => {

                                                const rating = item + 1;

                                                return (

                                                    <span
                                                        key={index}
                                                        className="color-span"
                                                    >

                                                        <input
                                                            type="checkbox"
                                                            placeholder="checkbox"
                                                            value={rating}
                                                            checked={ratingValue.includes(
                                                                rating
                                                            )}
                                                            onChange={(e) =>
                                                                handleRatingFilter(
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                            className="custom-checkbox"
                                                            id={`rating-${rating}`}
                                                        />

                                                        <label
                                                            htmlFor={`rating-${5 - item}`}
                                                        >

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


                                {/* =================================================
                STOCK FILTER
            ================================================= */}

                                <div className="single-filter">

                                    <span
                                        onClick={() =>
                                            handleColorFilterOpenClose("stock")
                                        }
                                    >

                                        <h3 className="filters-heading">
                                            Stock Status
                                        </h3>

                                        <i className="add-button-round">

                                            {stockOpen === "stock" ? (

                                                <FaMinus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            ) : (

                                                <FaPlus
                                                    size={14}
                                                    color="var(--secondary-color)"
                                                />

                                            )}

                                        </i>

                                    </span>


                                    <div
                                        className={`single-filter-items-container ${stockOpen === "stock"
                                                ? "show-single-filter-icons"
                                                : ""
                                            }`}
                                    >

                                        {allFilters?.stock?.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="color-span"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        placeholder="checkbox"
                                                        value={item.code}
                                                        checked={isStock?.includes(
                                                            item.code
                                                        )}
                                                        onChange={() =>
                                                            handleStock(item)
                                                        }
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

                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =========================================================
        PRODUCTS SECTION
        Only this area changes during loading/filtering.
    ========================================================= */}

                        <div
                            className={`sale-page-products-contain-container ${showFilters
                                    ? 'decrease-products-section'
                                    : ''
                                }`}
                        >

                            {/* PRODUCT HEADER */}

                            <div className="sale-products-len-and-show-filter-button-section">

                                {!showFilters && (

                                    <button
                                        className="sale-product-show-filter-button"
                                        onClick={() => setShowFilters(true)}
                                    >

                                        <CiCircleList
                                            size={15}
                                            color="#000"
                                        />

                                        Show Filters

                                    </button>

                                )}


                                <div className="mobile-view-left-side-clear-filter">
                                    <button
                                        className="mobile-sale-product-show-filter-button"
                                        onClick={() =>
                                            setShowMobileFilters(true)
                                        }
                                    >

                                        <CiCircleList
                                            size={15}
                                            color="#000"
                                        />

                                        Show Filters

                                    </button>
                                    <h3 className="sale-products-total-len">

                                        {isLoadingProducts ? (

                                            "Loading Products..."

                                        ) : hasNoProducts ? (

                                            "No Products Found"

                                        ) : (

                                            (() => {
                                                const isFilterApplied = searchParams.toString() !== "";
                                                const count = isFilterApplied
                                                    ? (sortedProducts?.length || 0)
                                                    : (totalProducts || 0);

                                                return `${count} ${count > 1 ? "Products Found" : "Product Found"}`;
                                            })()

                                        )}

                                    </h3>


                                </div>
                                {searchParams.toString() !== "" && <p className="mob-clear-filter" onClick={handleClearFilters}>
                                    Clear Filters
                                </p>}


                                {/* PRODUCT COUNT */}



                            </div>




                            {/* =====================================================
            PRODUCT GRID

            IMPORTANT:
            Filters remain visible.
            Only this section switches between:
            - Loading
            - No Products
            - Products
        ===================================================== */}

                            <div
                                className={`active-sale-cards ${showFilters
                                        ? 'grid-col-3'
                                        : ''
                                    } increase-columns ${activeGrid === 'single-col'
                                        ? 'offer-cards-single-grid'
                                        : 'offer-cards-dual-col'
                                    }`}
                            >

                                {/* ============================
                LOADING
            ============================ */}

                                {isLoadingProducts ? (

                                    Array.from({ length: 12 }).map(
                                        (_, index) => (

                                            <ProductCardShimmer
                                                key={index}
                                                width="100%"
                                            />

                                        )
                                    )

                                ) : hasNoProducts ? (

                                    /* ============================
                                       NO PRODUCTS
                                    ============================ */

                                    <div className="product-not-found-container sale">

                                        <Image
                                            src="/Assets/icon/product-empty.png"
                                            width={120}
                                            height={120}
                                            alt="no found"
                                        />

                                        <h3>
                                            No Products Found
                                        </h3>

                                        <p>
                                            Your search did not match any product.
                                        </p>

                                        <button
                                            className="no-product-clear-filter-button"
                                            onClick={handleClearFilters}
                                        >
                                            Clear Filters
                                        </button>

                                    </div>

                                ) : (

                                    /* ============================
                                       PRODUCTS
                                    ============================ */

                                    sortedProducts?.map(
                                        (item, index) => (

                                            <ProductCardTwo
                                                key={item._id || index}

                                                slug={item.slug}

                                                singleProductData={item}

                                                maxWidthAccordingToComp="100%"

                                                justWidth="100%"

                                                colTwo={
                                                    activeGrid === 'single-col'
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
                                                        ? 'tag-img'
                                                        : 'heart-icon'
                                                }

                                                mainImage={`${item.image.image_url}`}

                                                productCardContainerClass="product-card"

                                                ProductSku={item.sku}

                                                tags={item.sale_tag}

                                                ProductTitle={item.name}

                                                reviewCount={item.reviewCount}

                                                lowPriceAddvertisement={
                                                    item.lowPriceAddvertisement
                                                }

                                                priceTag={item.regular_price}

                                                sale_price={item.sale_price}

                                                financingAdd={item.financingAdd}

                                                learnMore={item.learnMore}

                                                mainIndex={index}

                                                deliveryTime={item.deliveryTime}

                                                stock={item.manage_stock}

                                                attributes={item.attributes}

                                                handleCardClick={() =>
                                                    handleProductClick(item)
                                                }

                                                handleQuickView={() =>
                                                    handleQuickViewOpen(item)
                                                }

                                                handleWishListclick={() =>
                                                    handleWishList(item)
                                                }

                                                showOnPage={true}

                                                createdDate={item.createdAt}

                                                showExtraLines={true}

                                                titleHeight={false}

                                                allow_back_order={
                                                    item?.allow_back_order
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
                                    )

                                )}

                            </div>


                            {/* =====================================================
            VIEW MORE
        ===================================================== */}

                            {totalProducts > 16 &&
                                !isLoadingProducts &&
                                !hasNoProducts && (

                                    <div className="active-sale-view-more-button-contianer">

                                        <button
                                            className="active-sale-view-more-button"
                                            onClick={handleNavigateToOutlate}
                                        >
                                            View More Products
                                        </button>

                                    </div>

                                )}

                        </div>

                    </div>


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