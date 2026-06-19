import React, { useState, useEffect, useRef } from 'react'
import './SimillerProducts.css'
import axios from 'axios'
import heart from '../../../Assets/icons/heart-vector.png'
import ProductCardShimmer from '../Loaders/productCardShimmer/productCardShimmer'
import { useList } from '../../../context/wishListContext/wishListContext'
import ProductCardTwo from '../ProductCardTwo/ProductCardTwo'
import QuickView from '../QuickView/QuickView'
import { useRouter } from 'next/navigation'
import SnakBar from '@/Global-Components/SnakeBar/SnakBar'
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider'
import ArrowSlider from '@/UI/Sliders/ArrowsSlider/ArrowSlider'
import { url, useDisableBodyScroll } from '@/utils/api'
import { useCart } from '@/context/cartContext/cartContext'
import { useGlobalContext } from '@/context/GlobalContext/globalContext'


const SimillerProducts = ({ isPadding, productId }) => {

  const [data, setData] = useState()

  const fetchCollections = async () => {
    const api = `${url}/api/v1/products/get-collection-products/${productId}`

    try {
      const response = await axios.get(api)
      if (response.status === 200) {
        setData(response.data.products)
      }
    } catch (error) {
      console.error("UnExpected Server Error", error);
    }
  }

  const {addToCart0} = useCart()

  

  useEffect(() => {
    if (!productId) return
    fetchCollections()
  }, [productId])

  const handleAddToCart = (item) => {
    const defaultVariation = item.variations.find((itm) => itm.is_default_variation === 1 )
    addToCart0(item, defaultVariation, 0, 1)

  }


  const [quickViewProduct, setQuickViewProduct] = useState({})
  const [quickViewClicked, setQuickView] = useState(false);


  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item)

  }

  const handleQuickViewClose = () => { setQuickView(false) }

  const router = useRouter();

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

  const handleProductClick = (item) => {
    setQuickView(false)
    router.push(`/product/${item.slug}`, { state: item });
  };

  const {isDeliveryAllowed} = useGlobalContext()

  useDisableBodyScroll(quickViewClicked)

  return (
    data?.length > 0 && (
      <div className={`similler-products-main-container ${isPadding ? 'add-padding' : ''}`}>
        <h2>Shop From This Collection</h2>

        <div className='cart-related-products-slider-main-div'>

          {data ? (
            <ArrowSlider
              slidesData={data}
              renderSlide={(item, index) => (
                <div key={index} className='cart-latest-product-cards-container'>
                  <ProductCardTwo
                    key={index}
                    slug={item.slug}
                    singleProductData={item}
                    maxWidthAccordingToComp={"98%"}
                    justWidth={'100%'}
                    showOnPage={true}
                    percent={'12%'}
                    titleHeight={true}
                    tagIcon={item.productTag ? item.productTag : heart}
                    tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                    mainImage={`${item.image.image_url}`}
                    productCardContainerClass="product-card"
                    ProductSku={item.sku}
                    tags={item.sale_tag}
                    allow_back_order={item?.allow_back_order}
                    ProductTitle={item.name}
                    colTwo={true}
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
                    btnText='Add To Cart'
                    isQuickView={isDeliveryAllowed}
                    handleCardClick={() => handleProductClick(item)}
                    handleQuickView={() => handleAddToCart(item)}
                    handleWishListclick={() => handleWishList(item)}
                    productTag={item.product_tag}
                  />
                  {/* <ProductCardTwo
                    key={item.slug}
                    slug={item.slug}
                    singleProductData={item}
                    showOnPage={true}
                    showExtraLines={true}
                    titleHeight={true}
                    productUid={item.uid}
                    maxWidthAccordingToComp={"100%"}
                    justWidth={'100%'}
                    tagIcon={item.productTag ? item.productTag : '/Assets/icons/heart-vector.png'}
                    tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
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
                    handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                    
                  /> */}
                </div>
              )}
              showDots={false}
              showArrows={true}
              spaceBetween={10}
              isPadding={true}
              breakpoints={{
                0: { slidesPerView: 1 },
                481: {slidesPerView: 2},
                768: {slidesPerView: 3},
                1024: { slidesPerView: 4 },
              }}
            />
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardShimmer />
            ))
          )}
        </div>

        <div className='related-products-mobile-view-container'>
          {data ? (
            <SwiperSlider
              slidesData={data}
              renderSlide={(item, index) => (
                <div key={index} className='cart-latest-product-cards-container'>
                  <ProductCardTwo
                    key={index}
                    slug={item.slug}
                    singleProductData={item}
                    maxWidthAccordingToComp={"100%"}
                    justWidth={'100%'}
                    showOnPage={true}
                    percent={'12%'}
                    showExtraLines={false}
                    // titleHeight={true}
                    tagIcon={item.productTag ? item.productTag : heart}
                    tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                    mainImage={`${item.image.image_url}`}
                    productCardContainerClass="product-card"
                    ProductSku={item.sku}
                    tags={item.sale_tag}
                    allow_back_order={item?.allow_back_order}
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
                    isQuickView={isDeliveryAllowed}
                    handleCardClick={() => handleProductClick(item)}
                    handleQuickView={() => handleAddToCart(item)}
                    handleWishListclick={() => handleWishList(item)}
                    productUid={item.uid}
                    btnText='Add To Cart'
                    handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                    productTag={item.product_tag}
                  />
                </div>
              )}
              showDots={true}
              showArrows={false}
              spaceBetween={15}
              isPadding={true}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 4 },
              }}
            />
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardShimmer />
            ))
          )}
        </div>

        <QuickView
          setQuickViewProduct={quickViewProduct}
          quickViewShow={quickViewClicked}
          quickViewClose={handleQuickViewClose}
        />

        <SnakBar
          message={snakeBarMessage}
          openSnakeBarProp={showSnakeBar}
          setOpenSnakeBar={setShowSnakeBar}
          onClick={handleCloseSnakeBar}
        />
      </div>

    )
  )
}
export default SimillerProducts