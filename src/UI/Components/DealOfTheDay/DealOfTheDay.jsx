import React, { useState, useEffect } from 'react'
import './DealOfTheDay.css';
import DealOfTheDayCard from './DealOfTheDayCard/DealOfTheDayCard';
import { calculateDiscountPercentage } from '../../../utils/api';
import { useSingleProductContext } from '../../../context/singleProductContext/singleProductContext';
import { useList } from '../../../context/wishListContext/wishListContext';
import ShareProduct from '../ShareProduct/ShareProduct';
import DealOfTheMonthShimmer from './DealOfTheMonthShimmer/DealOfTheMonthShimmer';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/utils/Fetcher';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import ArrowSlider from '@/UI/Sliders/ArrowsSlider/ArrowSlider';
import { useIsTab } from '@/utils/isMobile';
import { useCart } from '@/context/cartContext/cartContext';

const DealOfTheDay = ({ dealEndTime, setDealEndTime, allProducts, setAllProducts, api, api2 }) => {

  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = () => {
    if (!dealEndTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const targetDate = new Date(dealEndTime).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;
    const padZero = (num) => String(num).padStart(2, '0');
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: padZero(Math.floor(difference / (1000 * 60 * 60 * 24))),
        hours: padZero(Math.floor((difference / (1000 * 60 * 60)) % 24)),
        minutes: padZero(Math.floor((difference / 1000 / 60) % 60)),
        seconds: padZero(Math.floor((difference / 1000) % 60)),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    return timeLeft;
  };

  useEffect(() => {
    if (dealEndTime) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [dealEndTime]);

  // Destructure timeLeft
  const { days, hours, minutes, seconds } = timeLeft;

  // Fetcher
  const [dealCounter, setDealCounter] = useState(0)
  // const { data: dealData, error: dealError, isLoading: dealLoading } = useSWR(api, fetcher, {
  //   revalidateOnFocus: false,
  //   revalidateOnReconnect: false,
  //   shouldRetryOnError: false,
  //   dedupingInterval: 1000 * 60 * 60 * 24 * 365
  // })

  const activeApi = api2 || api;

  const { data: dealData, error: dealError, isLoading: dealLoading } = useSWR(activeApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (dealError && dealCounter < 3) {
    setTimeout(() => {
      setDealCounter(retryCount + 1)
      mutate();
    }, 1000)
  }

  // useEffect(() => {
  //   if (dealData) {
  //     setAllProducts(dealData?.products)
  //     setDealEndTime(dealData?.dealOfMonthTiming?.datetime);
  //   }
  // }, [dealData])


  useEffect(() => {
    if (!dealData) return;

    // API2 response
    if (dealData?.data) {
      setAllProducts(dealData?.data?.products || []);
      setDealEndTime(dealData?.data?.datetime);
    }

    // API1 response (existing)
    else {
      setAllProducts(dealData?.products || []);
      setDealEndTime(dealData?.dealOfMonthTiming?.datetime);
    }

  }, [dealData])
  const getPublishedProducts = () => {
    const productWithDiscount = allProducts
      .filter((product) => product.parent === 0) // Add filter condition here
      .map((product) => {
        let newPrice = parseFloat(product.regular_price);

        if (product.discount && product.discount.is_discountable === 1) {
          const oldPrice = parseFloat(product.regular_price);
          const discountedValue = parseFloat(product.discount.discount_value);
          if (product.discount.discount_type === 'percentage') {
            newPrice = oldPrice - (oldPrice * (discountedValue / 100));
            newPrice = parseFloat(newPrice.toFixed(2));
          } else if (product.discount.discount_type === 'currency') {
            newPrice = oldPrice - discountedValue;
          } else {
            newPrice = oldPrice;
          }
        }

        return {
          ...product,
          newPrice
        };
      });


    return productWithDiscount;
  };

  const { addSingleProduct } = useSingleProductContext();
  const handleDealCardClick = (items) => {
    addSingleProduct(items)
    router.push(`/product/${items.slug}`)
  }

  let productCount = 0
  const publishedProductsLength = allProducts?.filter(product => product.status === 'published')
  productCount = publishedProductsLength?.length;

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

  const [isSharePopup, setIsSharePopup] = useState(null);
  const [selectedUid, setSelectedUid] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState()
  const handleShareProduct = (items) => {
    setIsSharePopup(items.uid)
    setSelectedProduct(items)
    setSelectedUid(items.uid);
  }

  const isTab = useIsTab()

  if (!allProducts.length > 0) {
    return
  }

  return (
    <div className='deal-of-the-day-main-container'>
      <div className='deal-of-the-day-border-heading'>
        <p>Deal Of The Month</p>
        <div className='deal-of-the-day-end-time'>
          <p>Ends in:</p>
          <p>{days} Days &nbsp; {hours} Hours &nbsp; {minutes} Min &nbsp; {seconds} Sec</p>
        </div>
      </div>
      <div className='deal-of-the-day-outer-container'>
        <div className='mobile-view-deal-of-the-day-timer-and-product-count'>
          <div className='mobile-view-timer'>
            <p>{days}d: {hours}h: {minutes}m: {seconds}s</p>
          </div>
          <h3 className='mobile-view-deal-of-the-day-product-count'>{productCount} Products</h3>
        </div>
        <div className='slider-main-container'>

          {allProducts?.length === 0 ? (
            <div className='deal-of-the-day-cards-shimmer-container'>
              <div className='desktop-view-shimmer'>
                {Array.from({ length: 4 }).map((_, index) => <DealOfTheMonthShimmer key={index} />)}
              </div>
              <div className='mobile-view-shimmer'>
                <DealOfTheMonthShimmer />
              </div>
            </div>
          ) : (
            <ArrowSlider
              slidesData={allProducts?.length > 0 && getPublishedProducts()}
              renderSlide={(items) => (
                <DealOfTheDayCard
                  key={items._id}
                  isDiscountable={items.discount.is_discountable === 1 ? true : false}
                  productImage={items?.images?.[0]?.image_url}
                  dealDayData={items}
                  name={items.name}
                  rating={items?.average_rating}
                  review={'200'}
                  price={items.regular_price}
                  newPrice={items.sale_price}
                  descount={items.disc}
                  dicountPercent={calculateDiscountPercentage(items.sale_price, items.regular_price)}
                  handleDealCardClick={() => handleDealCardClick(items)}
                  handleWishListClick={() => handleWishList(items)}
                  handleShareProduct={() => handleShareProduct(items)}
                />
              )}
              showDots={true}
              showArrows={true}
              arrowLeftPosition={true}
              eachSlide={true}
              spaceBetween={isTab ? 10 : 35}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            />
          )}
        </div>
      </div>
      <ShareProduct
        isSharePopup={isSharePopup}
        setIsSharePopup={setIsSharePopup}
        selectedUid={selectedUid}
        setSelectedUid={setSelectedUid}
        selectedProduct={selectedProduct}
      />

      <SnakBar
        message={snakeBarMessage}
        openSnakeBarProp={showSnakeBar}
        setOpenSnakeBar={setShowSnakeBar}
        onClick={handleCloseSnakeBar}
      />
    </div>
  )
}

export default DealOfTheDay