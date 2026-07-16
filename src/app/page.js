'use client'

import React, { useRef, useState } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css';


// components
import Category from '@/UI/Components/Category/Category';
import ProductSlider from '@/UI/Components/ProductSlider/ProductSlider';
import GetTheScop from '@/UI/Components/GetTheScop/GetTheScop';
import Sliderr from '@/Global-Components/Slider/Slider';
import BlogSlider from '@/UI/Components/BlogSlider/BlogSlider';
import NearStorePopUp from '@/UI/Components/NearStorePopUp/NearStorePopUp';
import BestSellerSlider from '@/UI/Components/BestSellerSlider/BestSellerSlider';
import InstaGallery from '@/UI/Components/InstaGallery/InstaGallery';
import FinanceBannerSlider from '@/UI/Components/FinanceBannerSlider/FinanceBannerSlider';
import Comparision from '@/UI/Components/Comparision/Comparision';
import DealOfTheDay from '@/UI/Components/DealOfTheDay/DealOfTheDay';
import TrendingNow from '@/UI/Components/TrendingNow/TrendingNow';
import FurnitureForBudget from '@/UI/Components/FurnitureForBudget/FurnitureForBudget';
import MobileFinancingSlider from '@/UI/Components/FinanceBannerSlider/MobileFinancingSlider';
import FinanceBanner2 from '@/UI/Components/FinanceBannerSlider/FinanceBanner2';
import InstaTwoImageGallery from '@/UI/Components/InstaTwoImageGallery/InstaTwoImageGallery';
import { useLPContentContext } from '@/context/LPContentContext/LPContentContext';
import LandingPageFinancing from '@/UI/Components/LandingPageFinancingBanners/LandingPageFinancing';
import { useBlog } from '@/context/BlogsContext/blogsContext';
import { useRouter } from 'next/navigation';
import { url } from '@/utils/api';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import ZipCodeModal from '@/UI/Modals/ZipCodeModal/ZipCodeModal';
import ExampleButton from '@/utils/exampleBtn';
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import ReviewCard from '@/Global-Components/ReviewCards/ReviewCard';
import ReviewsSlider from '@/Global-Components/Reviews/Reviews';

const Home = () => {


  const {
    landingPageCategories,
    landingPageFOEB,
    content2,
    featuredProducts,
    slides,
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
    reviews,
    reviewsLoading,
  } = useLPContentContext();

  const { blogs } = useBlog()

  const router = useRouter();
  // const handleNavigate = (slug, item) => {
  //   const queryString = new URLSearchParams(item).toString();
  //   router.push(`/${slug}${queryString}`);
  // };

  const [showSnakeBar, setShowSnakeBar] = useState(false);
  const [snakeBarMessage, setSnakeBarMessage] = useState();

  const handleCloseSnakeBar = () => {
    setShowSnakeBar(false)
  }

  const homePageRef = useRef()
  const { showDeliveryMessage } = useGlobalContext()


  return (
    <div ref={homePageRef} className='home-page-main-container'>

   
     
      <NearStorePopUp />
      <Sliderr images={slides ? slides : []} />
      <FinanceBannerSlider images={financingBanners} borderTop={'5px solid #963A0B'} />
      <MobileFinancingSlider images={financingBanners} borderTop={'5px solid #963A0B'} />
      <Category source='home' title={'Shop by Category'} categoryData={landingPageCategories} handleNavigate={() => { }} />

      <LandingPageFinancing />
      <TrendingNow data={trendingNow ? trendingNow : null} />

      <BestSellerSlider
        allProducts={bestSellerProducts}
        setAllProducts={setBestSellerProducts}
        bestSellerNav1={bestSellerNav1}
        setBestSellerNav1={setBestSellerNav1}
        setShowSnakeBar={setShowSnakeBar}
        setSnakeBarMessage={setSnakeBarMessage}
      />



      {/* {content2?.section_1 && (
        <Comparision
          heading={content2.section_1.heading}
          image={content2.section_1.image}
          mobileImage={content2.section_1.mobile_image}
        />
      )}  */}

      {featuredProducts &&
        (<ProductSlider cardData={featuredProducts} />)
      }
      {content2?.section_2 && (
        <FinanceBanner2
          heading={content2.section_2?.heading}
          image={content2.section_2?.image}
          mobileImage={content2.section_2?.mobile_image}
        />
      )}


      <DealOfTheDay
        allProducts={allProducts}
        setAllProducts={setAllProducts}
        dealEndTime={dealEndTime}
        setDealEndTime={setDealEndTime}
        api={`${url}/api/v1/products/get-deal-of-month-products?limit=10`}
        api2={`${url}/api/v1/deal_of_the_month/getDealOfTheMonthTime`}
      />
      {landingPageFOEB && (
        <FurnitureForBudget budgetCardData={landingPageFOEB} />
      )}

       <ReviewsSlider reviews={reviews} isLoading={reviewsLoading} />

      {blogs?.length > 0 && <BlogSlider />}

      <GetTheScop
        setShowSnakeBar={setShowSnakeBar}
        setSnakeBarMessage={setSnakeBarMessage}
      />

      <SnakBar
        message={snakeBarMessage}
        openSnakeBarProp={showSnakeBar}
        setOpenSnakeBar={setShowSnakeBar}
        onClick={handleCloseSnakeBar}
      />

      {showDeliveryMessage && (
        <DisableDelivery parentRef={homePageRef} />
      )}

    </div>
  )
}

export default Home