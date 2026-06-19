import React, { useState, useEffect } from 'react'
import './FrequentlyBought.css';
import axios from 'axios';
import heart from '../../../Assets/icons/heart-vector.png'
import ProductCardShimmer from '../Loaders/productCardShimmer/productCardShimmer';
import { useList } from '../../../context/wishListContext/wishListContext';
import ProductCardTwo from '../ProductCardTwo/ProductCardTwo';
import QuickView from '../QuickView/QuickView';
import { useRouter } from 'next/navigation';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import { url, useDisableBodyScroll } from '@/utils/api';
import { useIsTab } from '@/utils/isMobile';

const FrequentlyBought = ({ isPadding, product }) => {

    const [data, setData] = useState()


    const handleFrequentlyBought = async () => {
        if (!product || !product.name || !product.categories || !product._id) {
            return;
        }

        const api = `${url}/api/v1/products/get-related-products`;
        const payload = {
            categories: product.categories,
            productName: product.name,
            currentProductId: product._id
        }

        try {
            const response = await axios.post(api, payload);
            if (response.status === 200) {
                setData(response.data.products)
            }
        } catch (error) {
            console.error("UnExpected Server Error", error)
        }
    }

    useEffect(() => {
        handleFrequentlyBought()
    }, [product])

    const router = useRouter();

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

    const [quickViewClicked, setQuickView] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState({})
    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item)
    }
    const handleQuickViewClose = () => { setQuickView(false) }

    const handleProductClick = (item) => {
        setQuickView(false)
        router.push(`/product/${item.slug}`, { state: item });
    };

    useDisableBodyScroll(quickViewClicked)




    return (
        data?.length > 0 && (
            <div className={`frequently-bought-main ${isPadding ? 'add-padding' : ''}`}>
                <h2>You May Also Like</h2>
                <div className='frequently-bought-card'>
                    {data ? (
                        data && data?.slice(0, 4).map((item, index) => (
                            <ProductCardTwo
                                key={index}
                                slug={item.slug}
                                singleProductData={item}
                                maxWidthAccordingToComp={"98%"}
                                justWidth={'100%'}
                                showOnPage={true}
                                percent={'12%'}
                                // titleHeight={true}
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
                                handleCardClick={() => handleProductClick(item)}
                                handleQuickView={() => handleQuickViewOpen(item)}
                                handleWishListclick={() => handleWishList(item)}
                                productTag={item.product_tag}
                            />
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardShimmer key={index} />
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

export default FrequentlyBought
