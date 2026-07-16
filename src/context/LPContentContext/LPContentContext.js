'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";
import axios from "axios";
import BestSellerSliderMainBanner from '../../Assets/Furniture Mecca/Landing Page/best seller products/Home Page Banner 396x595.jpg';
import { fetcher } from "@/utils/Fetcher";
import useSWR, { mutate } from "swr";

const LPContentContext = createContext();

export const LPContentProvider = ({ children }) => {
  const timeOut = process.env.REACT_APP_TIMEOUT
  const [data, setData] = useState(null);  // Store API data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);
  const [landingPageCategories, setLandingPageCategories] = useState([]);
  const [landingPageFOEB, setLandingPageFOEB] = useState([]);
  const [content2, setContent2] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const activeReviewsApi = `${url}/api/v1/what-customer-say/active`;


  // Standard Function
  const slidersApi = `${url}/api/v1/pages/home/upd-slider/get`;
  const [sliderCount, setSliderCount] = useState(0)
  const { data: sliderData, error: sliderError, isLoading: sliderLoading } = useSWR(slidersApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365,
  })

  if (sliderError && sliderCount < 3) {
    setTimeout(() => {
      setSliderCount(sliderCount + 1);
      mutate()
    }, 1000)
  }

  useEffect(() => {
    if (sliderData) {
      setSlides(sliderData.slider || [])
    }
  }, [sliderData])

  // Standard Function


  const landingPageContent2Api = `${url}/api/v1/content2/get`;
  const [constent2Counter, setContent2Counter] = useState(0);
  const { data: contentTwoData, error: content2Error, isLoading: content2Loader } = useSWR(landingPageContent2Api, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })
  if (content2Error && constent2Counter < 3) {
    setTimeout(() => {
      setContent2Counter(constent2Counter + 1);
    }, 1000)
  }
  useEffect(() => {
    if (contentTwoData) {
      setContent2(contentTwoData);
    }
  }, [contentTwoData])

  // Standard Function
  const featuredApi = `${url}/api/v1/products/featured-products?totalProduct=5`;
  const [featureCount, setFeatureCount] = useState(0);
  const { data: featureData, error: featureError, isLoading: featureLoading } = useSWR(featuredApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365,
  })

  if (featureError && featureCount < 3) {
    setTimeout(() => {
      setFeatureCount(featureCount + 1)
    }, 1000)
  }

  useEffect(() => {
    if (featureData) {
      const filteredProducts = featureData.products.filter(
        (product) => product.parent === 0
      );
      setFeaturedProducts(filteredProducts);
    }
  }, [featureData])


  const [trendingNow, setTrendingNow] = useState(null);

  // Standard Function
  const trandingNowApi = `${url}/api/v1/pages/home/trending-now/get`;
  const [trandingCount, setTrandingCount] = useState(0)
  const { data: trandingData, error: trandingError, isLoading: trandingLoader } = useSWR(trandingNowApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  });
  if (trandingError && trandingCount < 3) {
    setTimeout(() => {
      setTrandingCount(trandingCount + 1);
    }, 1000);
  }

  useEffect(() => {
    if (trandingData) {
      setTrendingNow(trandingData.data)
    }
  }, [trandingData])



  const [financingBanners, setFinancingBanners] = useState(null)
  // Standard Function

  const financingApi = `${url}/api/v1/pages/home/upd-finance-slider/get`;
  const [financingTry, setFinancingTry] = useState(0);
  const { data: financingData, error: finaningError, isLoading: finaincingLoading } = useSWR(financingApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (finaningError && financingTry < 3) {
    setTimeout(() => {
      setFinancingTry(financingTry + 1);
      mutate();
    }, 1000);
  }
  useEffect(() => {
    if (financingData) {
      setFinancingBanners(financingData.slider)
    }
  }, [financingData]);


  // set handling


  const categoryApi = `${url}/api/v1/content1/get`;
  const header = { "Content-Type": "application/json" };
  const [categoryCount, setCategoryCount] = useState(0);
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = useSWR(categoryApi, fetcher, header, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (categoriesError && categoryCount < 3) {
    setTimeout(() => {
      setCategoryCount(categoryCount + 1);
    }, 1000)
  }
  useEffect(() => {
    if (categoriesData) {
      setData(categoriesData);
      setLandingPageCategories(categoriesData?.landingPageContent?.sectional_schema?.shop_by_category);
      setLandingPageFOEB(categoriesData?.landingPageContent?.sectional_schema?.furniture_for_every_budget);
    }
  }, [categoriesData]);

  const [allProducts, setAllProducts] = useState([])
  const [dealEndTime, setDealEndTime] = useState(null);

  const [bestSellerProducts, setBestSellerProducts] = useState([])
  const [bestSellerNav1, setBestSellerNav1] = useState([
    {
      heading: "Living Room",
      image: BestSellerSliderMainBanner,
      slug: "living-room"
    },
    {
      heading: "Bedroom",
      image: BestSellerSliderMainBanner,
      slug: "bedroom"
    },
    {
      heading: "Dining Room",
      image: BestSellerSliderMainBanner,
      slug: "dining-room"
    },
  ]);



  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(0);

  const {
    data: reviewsData,
    error: reviewsError,
    isLoading: reviewsLoading,
  } = useSWR(activeReviewsApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365,
  });

  if (reviewsError && reviewsCount < 3) {
    setTimeout(() => {
      setReviewsCount((prev) => prev + 1);
      mutate(activeReviewsApi);
    }, 1000);
  }

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData.data || []);
    }
  }, [reviewsData]);

  // Category Page States
  const [categoryPageData, setCategoryPageData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [bestSelling, setBestSelling] = useState();
  const [paragraph, setParagraph] = useState(null);


  return (
    <LPContentContext.Provider value={{
      data,
      loading,
      landingPageCategories,
      landingPageFOEB,
      setLandingPageFOEB,
      content2,
      setContent2,
      featuredProducts,
      setFeaturedProducts,
      slides,
      setSlides,
      trendingNow,
      financingBanners,
      allProducts,
      setAllProducts,
      dealEndTime,
      setDealEndTime,
      bestSellerProducts,
      setBestSellerProducts,
      bestSellerNav1,
      setBestSellerNav1,
      categoryPageData,
      setCategoryPageData,
      categoryData,
      setCategoryData,
      bestSelling,
      setBestSelling,
      paragraph,
      setParagraph,
      reviews,
      reviewsLoading,
    }}>
      {children}
    </LPContentContext.Provider>
  );
}

export const useLPContentContext = () => {
  return useContext(LPContentContext);
};