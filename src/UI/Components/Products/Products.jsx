"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Products.css";

import { MdKeyboardArrowDown } from "react-icons/md";
import { FaPlus, FaTruck, FaLocationDot, FaMinus } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Components
import ProductCardShimmer from "../Loaders/productCardShimmer/productCardShimmer";
import QuickView from "../QuickView/QuickView";
import MobileViewProductFilters from "../MobileViewProductFilters/MobileViewProductFilters";

// Functions and Context
import { formatedPrice, url, useDisableBodyScroll } from "../../../utils/api";
import axios from "axios";
import { useCart } from "@/context/cartContext/cartContext";
import { useList } from "@/context/wishListContext/wishListContext";
import DoubleRangeSlider from "@/Global-Components/MultiRangeBar/MultiRange";
import RatingReview from "../starRating/starRating";
import ProductCardTwo from "../ProductCardTwo/ProductCardTwo";
import { useProductArchive } from "@/context/ActiveSalePageContext/productArchiveContext";
import SortModal from "@/UI/Modals/SortModal/SortModal";
import { IoArrowBack } from "react-icons/io5";
import SnakBar from "@/Global-Components/SnakeBar/SnakBar";
import ProductInfoModal from "@/Global-Components/ProductInfoModal/ProductInfoModal";
import SectionLoader from "../Loader/SectionLoader";
import Image from "next/image";
import {
  useRouter,
  useSearchParams,
  useParams,
  usePathname,
} from "next/navigation";
import Link from "next/link";
import Loader from "../Loader/Loader";
import ElipticalPagenation from "./ElepticalPagination";
import { useIsTab } from "@/utils/isMobile";

const Products = ({ navigationType }) => {
  // All Contexts
  const { cartSection } = useCart();

  const {
    products,
    setProducts,
    activePage,
    setActivePage,
    activePageIndex,
    setActivePageIndex,
    allFilters,
    setAllFilters,
    priceRange,
    setPriceRange,
    subCategories,
    setSubCategories,
    totalPages,
    setTotalPages,
    colorValue,
    setColorValue,
    sortProducts,
    selectedRelevanceValue,
    setSelectedRelevanceValue,
    collectionValue,
    setCollectionValue,
    brandValue,
    setBrandValue,
    isFeatured,
    setIsFeatured,
    isStock,
    setIsStock,
  } = useProductArchive();

  const slug = useParams();
  const subCategorySlug = slug["product-archive"];

  const location = useSearchParams();
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1]; // "accent-furniture"
  // const formatted =
  //   firstSegment
  //     .split("-") // ['accent', 'furniture']
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each
  //     .join(" ") + "s";

  const formatted = (() => {
  const text = firstSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return /s$/i.test(text) ? text : `${text}s`;
})();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hideFilters, setHideFilters] = useState(false);
  const [relevanceTrue, setRelevanceTrue] = useState(false);
  const [quickViewClicked, setQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState({});
  const [colors, setColors] = useState([]);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [noProducts, setNoProducts] = useState(false);
  const [filtereState, setFilterState] = useState(false);
  const [clearFilters, setClearFilters] = useState(true);
  const pathSegments = pathname?.split("/").filter(Boolean);
  const currentRoute = pathSegments[pathSegments?.length - 1];
  const [isOpen, setIsOpen] = useState("color-filter");
  const [ratingOpen, setRatingOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState("");
  const [brandOpen, setBrandOpen] = useState("");
  const [highlightOpen, setHighlightOpen] = useState("");
  const [stockOpen, setStockOpen] = useState("");
  const [ratingValue, setRatingValue] = useState([]);
  const [isLocationCheck, setIsLocationCheck] = useState(false);
  const [isDeliveryCheck, setIsDeliveryCheck] = useState(false);
  const { addToList, removeFromList, isInWishList } = useList();
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const [userId, setUserId] = useState("");
  const [userToken, setUserToken] = useState("");
  const [selectedGrid, setSelectedGrid] = useState("single-col");
  const [activeGrid, setActiveGrid] = useState("single-col");
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [regPrice, setRegPrice] = useState("");

  const router = useRouter();

  // Sub Categories show
  const categorySlug = useParams();
  const parentCategory = categorySlug.category;

  const getSubCategories = async () => {
    const api = `/api/v1/sub-category/get/${parentCategory}`;

    try {
      const response = await axios.get(`${url}${api}`);
      if (response.status === 200) {
        const result = response.data.sub_categories;
        setSubCategories(result);
      } else {
        console.error("UnExpected Error", response.status);
      }
    } catch (error) {
      console.error("UnExpected Server Error", error);
    }
  };

  const handleFilterSection = () => {
    setHideFilters(!hideFilters);
  };

  const fetchFilters = async () => {
    const api = `/api/v1/products/by-category/filters?categorySlug=${subCategorySlug}`;
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

  const handleColorFilterOpenClose = (type) => {
    setIsOpen((prevOpen) => (prevOpen === type ? "" : type));
    setRatingOpen((prevOpen) => (prevOpen === type ? "" : type));
    setCollectionOpen((prevOpen) => (prevOpen === type ? "" : type));
    setBrandOpen((prevOpen) => (prevOpen === type ? "" : type));
    setHighlightOpen((prevOpen) => (prevOpen === type ? "" : type));
    setStockOpen((prevOpen) => (prevOpen === type ? "" : type));
  };

  const handleRangeChange = (newRange) => {
    const params = new URLSearchParams(window.location.search);
    if (newRange[0] !== priceRange[0] || newRange[1] !== priceRange[1]) {
      setPriceRange(newRange);
    }

    params.set("price", newRange.join(","));

    params.set("page", 1);
    setActivePage(1);
    setActivePageIndex(1);

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

    // Always reset to page 1 on filter change
    params.set("page", "1");
    setActivePage(1);
    setActivePageIndex(1);

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

    params.set("page", 1);
    setActivePage(1);
    setActivePageIndex(1);

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
    params.set("page", "1");
    setActivePage(1);
    setActivePageIndex(1);

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
    params.set("page", "1");
    setActivePage(1);
    setActivePageIndex(1);

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
    params.set("page", "1");
    setActivePage(1);
    setActivePageIndex(1);

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
    params.set("page", "1");
    setActivePage(1);
    setActivePageIndex(1);

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

  const handleCategorySelect = (value) => {};

  const [trigerProductCall, setTrigerProdutCall] = useState(false);
  const handleClearFilters = () => {
    setPriceRange([priceRange[0], priceRange[1]]);
    setColorValue([]);
    setRatingValue([]);
    setCollectionValue([]);
    setBrandValue([]);
    setIsFeatured([]);
    setIsStock([]);
    setActivePage(1);
    setActivePageIndex(1);
    setTrigerProdutCall((prev) => !prev);

    const pathname = window.location.pathname;
    router.replace(pathname, { shallow: true });

    fetchFilters();
    filterProducts("");
  };

  const filterProducts = async (filter) => {
    const api = `/api/v1/products/by-category?categorySlug=${subCategorySlug}&${filter}&per_page=24`;
    try {
      setClearFilters(true);
      const response = await axios.get(`${url}${api}`);
      let data = response.data.products;
      switch (selectedRelevanceValue) {
        case "Recent":
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "By Price (Low to High)":
          data.sort((a, b) => a.sale_price - b.sale_price);
          break;
        case "By Price (High to Low)":
          data.sort((a, b) => b.sale_price - a.sale_price);
          break;
        case "Alphabetic (A to Z)":
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Alphabetic (Z to A)":
          data.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "By Ratings (Low to High)":
          data.sort(
            (a, b) =>
              parseFloat(a.average_rating) - parseFloat(b.average_rating)
          );
          break;
        case "By Ratings (High to Low)":
          data.sort(
            (a, b) =>
              parseFloat(b.average_rating) - parseFloat(a.average_rating)
          );
          break;

        default:
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setProducts(response.data.products);
      setTotalPages(response.data.pagination);
      if (!response.data.products.length > 0) {
        setFilterState(true);
        // setNoProducts(true);
      } else {
        setFilterState(false);
        // setNoProducts(false)
      }
    } catch (error) {
      console.error("Internal Server Error", error);
      setClearFilters(false);
    } finally {
      setClearFilters(false);
    }
  };

  // Product Side Head
  const getDeliveryDate = () => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();

    const optionWithTimeZone = { ...options, timeZone: "America/New_York" };

    today.setDate(today.getDate() + 3);
    return today.toLocaleDateString("en-us", optionWithTimeZone);
  };

  const handleLocationToggler = (e) => {
    setIsLocationCheck(e.target.checked);
    setLoader(true); // start loader
    setTimeout(() => {
      setLoader(false); // stop loader after 3 seconds
    }, 3000);
  };

  const [loader, setLoader] = useState(false);
  const handleDeliveryToggler = (e) => {
    setIsDeliveryCheck(e.target.checked);
    setLoader(true); // start loader
    setTimeout(() => {
      setLoader(false); // stop loader after 3 seconds
    }, 3000);
  };

  const relevanceData = [
    { name: "Recent" },
    { name: "By Price (Low to High)" },
    { name: "By Price (High to Low)" },
    { name: "Alphabetic (A to Z)" },
    { name: "Alphabetic (Z to A)" },
    { name: "By Ratings (Low to High)" },
    { name: "By Ratings (High to Low)" },
  ];

  const handleRelevance = () => {
    setRelevanceTrue(!relevanceTrue);
  };
  const pageFromURL = parseInt(searchParams.get("page") || "1");
  const fetchProductData = async () => {
    const queryApi = `/api/v1/products/by-name?name`;
    try {
      setClearFilters(true);
      let response;
      if (query) {
        response = await axios.get(`${url}${queryApi}=${query}`);
      } else {
        response = await axios.get(
          `${url}/api/v1/products/by-category?categorySlug=${subCategorySlug}&page=${pageFromURL}&per_page=24`
        );
      }

      const data = response.data.products || [];
      setTotalPages(response.data.pagination);

      switch (selectedRelevanceValue) {
        case "Recent":
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "By Price (Low to High)":
          data.sort((a, b) => a.sale_price - b.sale_price);
          break;
        case "By Price (High to Low)":
          data.sort((a, b) => b.sale_price - a.sale_price);
          break;
        case "Alphabetic (A to Z)":
          data.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Alphabetic (Z to A)":
          data.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "By Ratings (Low to High)":
          data.sort(
            (a, b) =>
              parseFloat(a.average_rating) - parseFloat(b.average_rating)
          );
          break;
        case "By Ratings (High to Low)":
          data.sort(
            (a, b) =>
              parseFloat(b.average_rating) - parseFloat(a.average_rating)
          );
          break;

        default:
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setProducts(data);
      setColors(colors);

      if (!response.data.products.length > 0) {
        setNoProducts(true);
      } else {
        setNoProducts(false);
      }
      fetchFilters();
    } catch (error) {
      console.error("Error fetching data:", error);
      setClearFilters(false);
    } finally {
      setClearFilters(false);
    }
  };

  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item);
  };

  const handleQuickViewClose = () => {
    setQuickView(false);
  };

  const handleProductClick = (item) => {
    router.push(`/product/${item.slug}`);
  };

  const handleWishList = async (item) => {
    setOpenSnakeBar(true);
    if (isInWishList(item._id)) {
      removeFromList(item._id);
      setWishlistMessage("Removed from wishlist");
    } else {
      addToList(item._id);
      setWishlistMessage("added to wishlist");
    }

    if (userId && userToken) {
      const api = `${url}/api/v1/web-users/wishlist/${userId}`;

      try {
        const response = await axios.put(
          api,
          { productId: item._id },
          {
            headers: {
              Authorization: userToken,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("UnExpected Server Error", error);
      }
    }
  };

  const handleCloseSnakeBar = () => {
    setOpenSnakeBar(false);
  };

  const pageCache = useRef({});

  const handleActivePage = (index) => {
    if (index !== activePageIndex) {
      const params = new URLSearchParams(window.location.search); // Use current URL
      params.set("page", index); // Update page param

      const queryString = params
        .toString()
        .replace(/%2C/g, ",")
        .replace(/\+/g, " ");
      const pathname = window.location.pathname;

      // Update URL without page reload
      router.replace(`${pathname}?${queryString}`, { shallow: true });

      // Update state
      setActivePage(index);
      setActivePageIndex(index);

      // Call sorting and filtering with updated query
      if (pageCache.current[index]) {
        setProducts(pageCache.current[index]);
      } else {
        sortProducts(selectedRelevanceValue);
        filterProducts(queryString);
      }

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (activePage > 1) {
      const newPage = activePage - 1;

      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage);

      const queryString = params
        .toString()
        .replace(/%2C/g, ",")
        .replace(/\+/g, " ");
      const pathname = window.location.pathname;

      router.replace(`${pathname}?${queryString}`, { shallow: true });

      setActivePage(newPage);
      setActivePageIndex(newPage);

      if (pageCache.current[newPage]) {
        setProducts(pageCache.current[newPage]);
      } else {
        sortProducts(selectedRelevanceValue);
        filterProducts(queryString);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPages?.totalPages) {
      const newPage = activePage + 1;

      const params = new URLSearchParams(window.location.search);
      params.set("page", newPage);

      const queryString = params
        .toString()
        .replace(/%2C/g, ",")
        .replace(/\+/g, " ");
      const pathname = window.location.pathname;

      router.replace(`${pathname}?${queryString}`, { shallow: true });

      setActivePage(newPage);
      setActivePageIndex(newPage);

      if (pageCache.current[newPage]) {
        setProducts(pageCache.current[newPage]);
      } else {
        sortProducts(selectedRelevanceValue);
        filterProducts(queryString);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleActiveGrid = (grid) => {
    setActiveGrid(grid);
    setSelectedGrid(grid);
  };

  const handleMobileFilters = () => {
    setMobileFilters(true);
  };

  const handleOpenSortModal = () => {
    setShowSortModal(true);
  };

  const handleCloseSortModal = () => {
    setShowSortModal(false);
  };

  const handleSelectMobileRelevanceValue = (name) => {
    sortProducts(name);
    setShowSortModal(false);
  };

  const handleOpennfoModal = (salePrice, regPrice) => {
    setIsInfoOpen(true);
    setSalePrice(salePrice);
    setRegPrice(regPrice);
  };

  const handleCloseInfoModal = () => {
    setIsInfoOpen(false);
    setSalePrice("");
    setRegPrice("");
  };

  useEffect(() => {
    getSubCategories();
  }, []);
  useEffect(() => {
    getSubCategories();
  }, [subCategorySlug]);

  useEffect(() => {
    fetchProductData();
  }, [location.pathname, query]);

  useEffect(() => {
    const userId = localStorage.getItem("uuid");
    const getToken = localStorage.getItem("userToken");
    if (getToken && userId) {
      setUserToken(getToken);
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    if (navigationType !== "POP" || products.length > 0) {
      setActivePage(1);
      setActivePageIndex(1);
    }
  }, [navigationType]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const pageFromURL = parseInt(searchParams.get("page")) || 1;

    // Update the active page and index
    setActivePage(pageFromURL);
    setActivePageIndex(pageFromURL);
    sortProducts(selectedRelevanceValue);
    filterProducts(searchParams.toString());

    setTimeout(() => {
      const currentScroll = window.scrollY;

      if (currentScroll > 10) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  }, [location.search]);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

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
  }, [subCategories]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  // Disable Scroll on Modal Open
  useDisableBodyScroll(
    isInfoOpen,
    quickViewClicked,
    showSortModal,
    mobileFilters,
    cartSection
  );

  return (
    <div className="products-main-container">
      {loader && <Loader />}
      <h1
        className={`select-your-category-products-heading ${
          currentRoute === "searched-products" ? "hide-category-heading" : ""
        }`}
      >
        Shop {formatted}
      </h1>
      {products?.length > 0 && (
        <div
          className={`product-archive-category-wrapper  ${
            currentRoute === "searched-products"
              ? "hide-category-images-main-contianer"
              : ""
          }`}
        >
          {showArrows && (
            <button
              className="category-scroll-button category-left"
              onClick={() => scrollLeft()}
              style={{ visibility: atStart ? "hidden" : "visible" }}
            >
              <IoIosArrowBack size={15} color="var(--orange-outline)" />
            </button>
          )}
          <div
            ref={scrollRef}
            className={`product-archive-sub-categories-container ${
              currentRoute === "searched-products"
                ? "hide-category-images-container"
                : ""
            }`}
            onMouseDown={handleMouseDown}
          >
            {subCategories
              .filter((item) => item.slug !== subCategorySlug)
              .map((item, index) => (
                <Link
                  href={`/${parentCategory}/${item.slug}`}
                  key={index}
                  className="product-archive-single-sub-category"
                >
                  {item.filterImage !== "" ? (
                    <img
                      src={` ${url}${item.filterImage}`}
                      alt="sub category"
                    />
                  ) : (
                    <img src={` ${url}${item.image2}`} alt="sub category" />
                  )}
                </Link>
            ))}
          </div>
          {showArrows && (
            <button
              className="category-scroll-button category-right"
              onClick={() => scrollRight()}
              style={{ visibility: atEnd ? "hidden" : "visible" }}
            >
              <IoIosArrowForward size={15} color="var(--orange-outline)" />
            </button>
          )}
        </div>
      )}

      <h3
        className={`searched-products-heading ${
          currentRoute !== "searched-products" ? "hide-searched-heading" : ""
        }`}
      >
        Searched Products for: {query}
      </h3>

      {
        // if no product found
        noProducts ? (
          <div className="product-not-found-container">
            <Image
              src={"/Assets/icon/product-empty.png"}
              width={120}
              height={120}
              alt="no found"
            />
            <h3>No Products Found</h3>
            <p>Your search did not match any product.</p>
          </div>
        ) : (
          // If Product Fount
          <div className="products-and-filter-container">
            {/* Filters side bar section code */}

            <div
              className={`filters-section ${
                filtereState ? "add-border-to-filters" : ""
              } ${hideFilters ? "hide-filter" : ""}`}
            >
              <div className={`hide-filters-btn`}>
                <button onClick={handleFilterSection}>
                  <IoArrowBack size={20} color="var(--secondary-color)" />
                  Hide Filters
                </button>
              </div>

              <div className="filters-inner-container">
                <div className="filters-heading-section">
                  <h3>Filters</h3>
                  <p onClick={handleClearFilters}>Clear Filters</p>
                </div>

                <div className="all-filters-section">
                  {/* Price Filter */}
                  <DoubleRangeSlider
                    min={allFilters?.priceRange?.minPrice}
                    max={allFilters?.priceRange?.maxPrice}
                    initialRange={priceRange}
                    setInitialRange={setPriceRange}
                    onRangeChange={handleRangeChange}
                    minLabel="Min Price:"
                    maxLabel="Max Price:"
                  />

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
                      className={`single-filter-items-container ${
                        isOpen === "color-filter"
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
                      className={`single-filter-items-container ${
                        highlightOpen === "highlight"
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
                      className={`single-filter-items-container ${
                        collectionOpen === "collections"
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
                      className={`single-filter-items-container ${
                        brandOpen === "brand" ? "show-single-filter-icons" : ""
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
                      className={`single-filter-items-container ${
                        ratingOpen === "rating-filter"
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
                      className={`single-filter-items-container ${
                        stockOpen === "stock" ? "show-single-filter-icons" : ""
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
            </div>

            {filtereState ? (
              <div className="product-not-found-container">
                <Image
                  src={"/Assets/icon/product-empty.png"}
                  width={120}
                  height={120}
                  alt="empty"
                />
                <h3>No Products Found</h3>
                <p>
                  We didn’t find any products that match all your selections.{" "}
                  <br />
                  Try Adjusting Your Filters for More Results.
                </p>
              </div>
            ) : (
              <div
                className={`products-section ${
                  hideFilters ? "full-width" : ""
                }`}
              >
                {clearFilters && <SectionLoader />}
                <div
                  className={`products-heading ${
                    query ? "query-hide-search-heading" : ""
                  }`}
                >
                  <div className="show-filter-btn-and-product-count">
                    <button
                      className={`tab-show-filter-btn`}
                      onClick={handleMobileFilters}
                    >
                      <Image
                        src={"/icons/filter.svg"}
                        width={15}
                        height={15}
                        alt="arrow black"
                        className={`show-filter-btn-arrow ${
                          hideFilters ? "rotate-show-filter-arrow-icon" : ""
                        }`}
                      />
                      Show Filters
                    </button>
                    <button
                      className={`show-filter-btn ${
                        hideFilters ? "hide-show-filter-btn" : ""
                      }`}
                      onClick={handleFilterSection}
                    >
                      <Image
                        src={"/icons/filter.svg"}
                        width={15}
                        height={15}
                        alt="arrow black"
                        className={`show-filter-btn-arrow ${
                          hideFilters ? "rotate-show-filter-arrow-icon" : ""
                        }`}
                      />
                      Show Filters
                    </button>
                    {products && products?.length > 0 ? (
                      <p>
                        {totalPages?.totalProducts} Items Starting at{" "}
                        {formatedPrice(allFilters?.priceRange?.minPrice)}
                      </p>
                    ) : (
                      <p className="total-product-count-shimmer"></p>
                    )}
                  </div>

                  <div className="toggler-main-container">
                    <div className="location-toggler">
                      <div className="location-toggler-button">
                        <label className="toggle14">
                          <input
                            type="checkbox"
                            checked={isDeliveryCheck}
                            onChange={handleDeliveryToggler}
                          />
                          <span className="slider">
                            <span className="circle"></span>
                          </span>
                        </label>
                      </div>
                      <FaTruck
                        size={20}
                        color={
                          isDeliveryCheck
                            ? "var(--tertiary-color)"
                            : "rgba(89, 89, 89, 0.5)"
                        }
                      />
                      <span>
                        <p>Get it by</p>
                        <h3
                          style={{
                            color: `${
                              isDeliveryCheck
                                ? "var(--tertiary-color)"
                                : "var(--secondary-color)"
                            }`,
                          }}
                        >
                          {getDeliveryDate()}
                        </h3>
                      </span>
                    </div>

                    <div className="location-toggler">
                      <div className="location-toggler-button">
                        <label className="toggle14">
                          <input
                            type="checkbox"
                            checked={isLocationCheck}
                            onChange={handleLocationToggler}
                          />
                          <span className="slider">
                            <span className="circle"></span>
                          </span>
                        </label>
                      </div>
                      <FaLocationDot
                        size={20}
                        color={
                          isLocationCheck
                            ? "var(--tertiary-color)"
                            : "rgba(89, 89, 89, 0.5)"
                        }
                      />
                      <span>
                        <p>See it in Person</p>
                        <h3
                          style={{
                            color: `${
                              isLocationCheck
                                ? "var(--tertiary-color)"
                                : "var(--secondary-color)"
                            }`,
                          }}
                        >
                          Venango
                        </h3>
                      </span>
                    </div>
                  </div>

                  <div className="relevance-container">
                    <div className="relevance-filters-body">
                      <div
                        className="relevance-filter-heading"
                        onClick={handleRelevance}
                      >
                        <p className="relevance-heading-text">Sort By</p>
                        <div className="selected-relevance-item">
                          <p className="selected-relevance-text">
                            {selectedRelevanceValue}
                          </p>
                          <i className="relevance-heading-icon">
                            <MdKeyboardArrowDown
                              className="relevance-heading-icon-rotate"
                              color="var(--secondary-color)"
                              size={15}
                            />
                          </i>
                        </div>
                      </div>
                      <div
                        className={`relevance-filter-items ${
                          relevanceTrue ? "show-relevance-items" : ""
                        }`}
                      >
                        {relevanceData.map((item, index) => (
                          <div
                            className="relevance-single-filter"
                            key={index}
                            onClick={() => {
                              setSelectedRelevanceValue(item.name);
                              setRelevanceTrue(false);
                              sortProducts(item.name);
                            }}
                          >
                            <p className="relevance-single-filter-name">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {currentRoute === "searched-products" ? (
                  <h3 className="searched-products-counter">
                    Searched Products {products.length}
                  </h3>
                ) : (
                  <></>
                )}
                <div
                  className={`product-main ${
                    hideFilters ? "increase-columns" : ""
                  }`}
                >
                  {products && products?.length > 0
                    ? products?.map((item, index) => {
                        return (
                          <ProductCardTwo
                            key={item.slug}
                            slug={item.slug}
                            singleProductData={item}
                            showOnPage={true}
                            showExtraLines={true}
                            titleHeight={true}
                            productUid={item.uid}
                            // maxWidthAccordingToComp={useIsTab ? '380px' : '100%'}
                            maxWidthAccordingToComp={"100%"}
                            justWidth={hideFilters ? "100%" : "100%"}
                            tagIcon={
                              item.productTag
                                ? item.productTag
                                : "/Assets/icons/heart-vector.png"
                            }
                            tagClass={
                              item.productTag ? "tag-img" : "heart-icon"
                            }
                            mainImage={`${item?.image?.image_url}`}
                            productCardContainerClass="product-card"
                            ProductSku={item.sku}
                            tags={item.sale_tag}
                            allow_back_order={item?.allow_back_order}
                            ProductTitle={item.name}
                            reviewCount={item.average_rating}
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
                            handleInfoModal={() =>
                              handleOpennfoModal(
                                item.sale_price,
                                item.regular_price
                              )
                            }
                            productTag={item.product_tag}
                          />
                        );
                      })
                    : Array.from({ length: 3 }).map((_, index) => (
                        <ProductCardShimmer key={index} width={"100%"} />
                      ))}
                </div>
                {/* Product Card Code End */}

                <ElipticalPagenation
                  activePageIndex={activePageIndex}
                  totalPages={totalPages?.totalPages}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                  onPageChange={handleActivePage}
                  marginTop={"0px !important"}
                />
              </div>
            )}
          </div>
        )
      }
      {/* Mobile view product section */}
      <div className="mobile-view-product-and-filter-section">
        <div className="mobile-view-filters-section">
          <div className="mobile-view-filter-head">
            <div className="mobile-view-product-count">
              <p>{totalPages?.totalProducts} items</p>
              <p>
                Starting at {formatedPrice(allFilters?.priceRange?.minPrice)}
              </p>
            </div>
            <div className="mobile-view-product-card-grid-select">
              <div
                className={`mobile-view-toggler-single-box ${
                  activeGrid === "single-col" ? "active-toggler-single-box" : ""
                }`}
              >
                <div
                  className={`mobile-view-card-grid-single-col ${
                    activeGrid === "single-col" ? "grid-active" : ""
                  }`}
                  onClick={() => handleActiveGrid("single-col")}
                ></div>
              </div>

              <div
                className={`mobile-view-toggler-double-box ${
                  activeGrid === "dual-col" ? "active-toggler-dual-col" : ""
                }`}
              >
                <div
                  className="mobile-view-card-grid-dual-col"
                  onClick={() => handleActiveGrid("dual-col")}
                >
                  <div
                    className={`mobile-view-card-grid-dual-col-inner ${
                      activeGrid !== "single-col" ? "active-dual-col" : ""
                    }`}
                  ></div>
                  <div
                    className={`mobile-view-card-grid-dual-col-inner ${
                      activeGrid !== "single-col" ? "active-dual-col" : ""
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-view-filter-body">
            <button
              className="mobile-view-show-filters"
              onClick={handleMobileFilters}
            >
              <Image
                src={"/icons/filter.svg"}
                width={20}
                height={20}
                alt="filter"
              />
              Show Filter
            </button>
            <button
              className={`mobile-view-sort-btn`}
              onClick={handleOpenSortModal}
            >
              <Image
                src={"/icons/sort.svg"}
                width={20}
                height={20}
                alt="arrow up down"
              />
              Sort
            </button>
          </div>
        </div>
        {noProducts ? (
          <div className="mobile-product-not-found-container">
            <Image
              src={"/Assets/icon/product-empty.png"}
              width={120}
              height={120}
              alt="no found"
            />
            <h3>No Products Found</h3>
            <p>Your search did not match any product.</p>
          </div>
        ) : filtereState ? (
          <div className="product-not-found-container">
            <Image
              src={"/Assets/icon/product-empty.png"}
              width={120}
              height={120}
              alt="empty"
            />
            <h3>No Products Found</h3>
            <p>
              We didn’t find any products that match all your selections. <br />
              Try Adjusting Your Filters for More Results.
            </p>
          </div>
        ) : (
          <div
            className={`${
              selectedGrid === "single-col"
                ? "mobile-view-product-single-column"
                : "mobile-view-products-main-container"
            } `}
          >
            {products.length === 0
              ? selectedGrid === "single-col"
                ? Array.from({ length: 1 }).map((_, index) => (
                    <ProductCardShimmer width={"100%"} key={index} />
                  ))
                : Array.from({ length: 2 }).map((_, index) => (
                    <ProductCardShimmer width={"100%"} key={index} />
                  ))
              : products.map((item, index) => {
                  return (
                    <ProductCardTwo
                      key={item.slug}
                      slug={item.slug}
                      singleProductData={item}
                      maxWidthAccordingToComp={"100%"}
                      justWidth={"100%"}
                      showOnPage={true}
                      showExtraLines={true}
                      percent={"12%"}
                      colTwo={selectedGrid === "single-col" ? false : true}
                      tagIcon={
                        item.productTag
                          ? item.productTag
                          : "/Assets/icons/heart-vector.png"
                      }
                      tagClass={item.productTag ? "tag-img" : "heart-icon"}
                      mainImage={`${item?.image?.image_url}`}
                      productCardContainerClass="product-card"
                      ProductSku={item.sku}
                      tags={item.sale_tag}
                      allow_back_order={item?.allow_back_order}
                      ProductTitle={item.name}
                      reviewCount={item.average_rating}
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
                      handleInfoModal={() =>
                        handleOpennfoModal(item.sale_price, item.regular_price)
                      }
                      productTag={item.product_tag}
                    />
                  );
                })}
          </div>
        )}
        {!noProducts && (
          <ElipticalPagenation
            activePageIndex={activePageIndex}
            totalPages={totalPages?.totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageChange={handleActivePage}
          />
        )}
      </div>

      <QuickView
        setQuickViewProduct={quickViewProduct}
        quickViewShow={quickViewClicked}
        quickViewClose={handleQuickViewClose}
      />

      <MobileViewProductFilters
        showMobileFilters={mobileFilters}
        setMobileFilters={setMobileFilters}
        filtersData={allFilters}
        subCategorySlug={subCategorySlug}
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
      <SortModal
        isOpenSort={showSortModal}
        handleCloseSortModal={handleCloseSortModal}
        setSelectedOption={setSelectedOption}
        handleSelect={handleSelectMobileRelevanceValue}
      />
      <SnakBar
        message={wishlistMessage}
        openSnakeBarProp={openSnakeBar}
        setOpenSnakeBar={setOpenSnakeBar}
        onClick={handleCloseSnakeBar}
      />
      <ProductInfoModal
        openModal={isInfoOpen}
        closeModal={handleCloseInfoModal}
        salePrice={salePrice}
        regPrice={regPrice}
      />
    </div>
  );
};
export default Products;
