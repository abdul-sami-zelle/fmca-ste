'use client'

// export default Categories
import React, { use, useEffect, useRef, useState } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css';
import './CategoryClient.css';
import Category from '@/UI/Components/Category/Category';
import LatestModulerBanner from '@/UI/Components/LatestModuler/LatestModulerBanner';
import CategoriesGetScop from '@/UI/Components/CategoriesGetScop/CategoriesGetScop';
import BestSeller from '@/UI/Components/BestSeller/BestSeller';
import { url } from '@/utils/api';
import { useSEOContext } from '@/context/SEOcontext/SEOcontext';
import { useLPContentContext } from '@/context/LPContentContext/LPContentContext';
import DealOfTheDay from '@/UI/Components/DealOfTheDay/DealOfTheDay';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/utils/Fetcher';
import useSWR, { mutate } from 'swr';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';

const CategoriesClient = ({ category }) => {

  const router = useRouter();
  const location = usePathname();
  const { setTitle, setDescription, setImage } = useSEOContext();
  const [contentImages, setContentImages] = useState([]);



  const {
    categoryPageData,
    setCategoryPageData,
    categoryData,
    setCategoryData,
    bestSelling,
    setBestSelling,
    paragraph,
    allProducts,
    setAllProducts,
    dealEndTime,
    setDealEndTime,
    setParagraph
  } = useLPContentContext();

  const [retryCount, setRetryCount] = useState(0);
  const subcategoryAPI = `${url}/api/v1/sub-category/get/${category}`
  const { data: subCategories, error: subCategoryError, checkLoading: subCategoryLoding } = useSWR(subcategoryAPI, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (subCategoryError && retryCount < 3) {
    setTimeout(() => {
      setRetryCount(retryCount + 1)
      mutate();
    }, 1000)
  }


  useEffect(() => {
    if (subCategories) {
      setCategoryPageData(subCategories.sub_categories);
      setBestSelling(subCategories.bestSelling);
      setParagraph(subCategories.content);
      setContentImages(subCategories.content_images);
    }
  }, [subCategories])

  const productCategoryApi = `${url}/api/v1/productCategory/get?slug=${category}`
  const [productCAtegoryCount, setProductCategoryCount] = useState(0)
  const { data: productCategory, error: productCategoryError, checkLoading: productCategoryLoading } = useSWR(productCategoryApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (productCategoryError && productCAtegoryCount < 3) {
    setTimeout(() => {
      setProductCategoryCount(productCAtegoryCount + 1);
      mutate()
    }, 1000)
  }

  useEffect(() => {
    if (productCategory) {
      setCategoryData(productCategory?.categories[0])

      setTitle(productCategory?.categories[0]?.meta.title);
      setDescription(productCategory?.categories[0]?.meta.description);
      setImage(url + productCategory?.categories[0]?.meta.og_image);
    }
  }, [productCategory])

  const handleNavigate = (slug, item) => {
    router.push(`/${category}/${item.slug}`, { state: item });
  };


  const {showDeliveryMessage} = useGlobalContext();
  const categoryRef = useRef()


  return (
    <div ref={categoryRef}>
      <LatestModulerBanner
        customWidth={false}
        showBanners={false}
        mainImgShow={true}
        mobileMainImage={location.state ? location.state?.bannerImage2 : categoryData?.bannerImage2}
        mainImage={location.state ? location.state?.bannerImage : categoryData?.bannerImage}
      />

      <Category marginTop='15px' title={location.state ? location.state?.name : categoryData?.name} categorySlug={category} categoryData={categoryPageData} handleNavigate={handleNavigate} />
      {bestSelling && (<BestSeller />)}
      {allProducts && (
        <DealOfTheDay
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          dealEndTime={dealEndTime}
          categorySlug={category}
          setDealEndTime={setDealEndTime}
          api={`${url}/api/v1/products/get-deal-of-month-products?limit=10&slug=${category}`}
        />
      )}

      <CategoriesGetScop text={paragraph} contentImages={contentImages} isTrue={true} />

      {showDeliveryMessage && (
        <DisableDelivery parentRef={categoryRef} />
      )}
    </div>
  )
}

export default CategoriesClient