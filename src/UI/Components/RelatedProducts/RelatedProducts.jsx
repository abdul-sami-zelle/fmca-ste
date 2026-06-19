import React, { useState } from 'react'
import './RelatedProducts.css'
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider'
import ProductCardTwo from '../ProductCardTwo/ProductCardTwo'
import ArrowSlider from '@/UI/Sliders/ArrowsSlider/ArrowSlider'
import heart from '../../../Assets/icons/heart-vector.png'
import QuickView from '../QuickView/QuickView'
import SnakBar from '@/Global-Components/SnakeBar/SnakBar'
import { useList } from '@/context/wishListContext/wishListContext'
import { useRouter } from 'next/navigation'
import { useDisableBodyScroll } from '@/utils/api'

const RelatedProducts = ({ data }) => {

  const [snakeBarMessage, setSnakBarMessage] = useState();
  const [showSnakeBar, setShowSnakeBar] = useState(false);
  const router = useRouter();

  const { addToList, removeFromList, isInWishList } = useList()
  const handleWishList = (item) => {
    if (isInWishList(item._id)) {
      removeFromList(item._id);
      setShowSnakeBar(true)
      setSnakBarMessage("Product Removed Successfully")

    } else {
      addToList(item._id)
      setSnakBarMessage("Product Added To Wishlist");
      setShowSnakeBar(true)

    }
  }
  const handleCloseSnakeBar = () => {
    setShowSnakeBar(false)
  }

  const [quickViewClicked, setQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState({})
  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item)
  }
  const handleQuickViewClose = () => { setQuickView(false) }

  const handleProductClick = (item) => {
    router.push(`/product/${item.slug}`, { state: item });
  };

  // useDisableBodyScroll(quickViewProduct)



  return (
    <div className='related-products-main-container'>
      <h2>Popular Items You May Like</h2>
      <div className='related-crds-slider-contaner'>

        <ArrowSlider
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
                handleCardClick={() => handleProductClick(item)}
                handleQuickView={() => handleQuickViewOpen(item)}
                handleWishListclick={() => handleWishList(item)}
                productUid={item.uid}
                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                productTag={item.product_tag}
              />
            </div>
          )}
          showDots={true}
          showArrows={true}
          spaceBetween={10}
          loop={false}
          isPadding={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            481: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1000: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
        />

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
}

export default RelatedProducts