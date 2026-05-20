'use client'

import React, { useEffect, useRef, useState } from 'react'
import './WishList.css';
// import {  useNavigate } from 'react-router-dom';
import { useList } from '../../../context/wishListContext/wishListContext';
import ProductCardShimmer from '../../Components/Loaders/productCardShimmer/productCardShimmer';
import star from '../../../Assets/icons/Star 19.png'
import heart from '../../../Assets/icons/heart-vector.png'
import { toast } from 'react-toastify';
import ProductCardTwo from '../../Components/ProductCardTwo/ProductCardTwo';
import QuickView from '../../Components/QuickView/QuickView';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { url } from '@/utils/api';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import Image from 'next/image';
import ProductInfoModal from '@/Global-Components/ProductInfoModal/ProductInfoModal';
import { useCart } from '@/context/cartContext/cartContext';
import SideCart from '../Cart-side-section/SideCart';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';


const WishListClient = () => {
  //   const navigate = useNavigate()
  const router = useRouter()
  const {
    wishList,
    addToList,
    removeFromList,
    isInWishList
  } = useList();

  const { cartSection, setCartSection } = useCart()
  const [loading, setLoading] = useState(true)
  const [quickViewClicked, setQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState({})
  const [activeGrid, setActiveGrid] = useState('single-col')
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const maxLength = 50;

  const [wishlistProducts, setWishlistProducts] = useState([])

  const [wishlistMessage, setWishlistMessage] = useState('')
  const [openSnakeBar, setOpenSnakeBar] = useState(false);
  const [updateProducts, setUpdateProducts] = useState(false)

  const handleWishListProducts = async () => {
    const wishlistItem = JSON.parse(localStorage.getItem('wishList')) || [];
    const productIds = wishlistItem.map(id => id); // assuming IDs stored in localStorage
    const userId = localStorage.getItem('uuid');
    const userToken = localStorage.getItem('userToken');

    setLoading(true);
    setWishlistProducts([]);

    try {
      let response;

      if (userId && userToken) {
        // Sync localStorage wishlist with server
        if (productIds.length > 0) {
          await axios.put(`${url}/api/v1/web-users/wishlist/${userId}`,
            { productIds },
            {
              headers: {
                Authorization: userToken,
                'Content-Type': 'application/json',
              }
            }
          );
        }

        // Fetch wishlist products from server
        response = await axios.get(`${url}/api/v1/web-users/wishlist/${userId}`, {
          headers: {
            Authorization: userToken,
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200) {
          setWishlistProducts(response.data.wishlist || []);
        }

      } else {
        // Guest mode
        if (productIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        response = await axios.post(
          `https://fmapi.myfurnituremecca.com/api/v1/products/get-by-ids`,
          { ids: productIds }
        );

        setWishlistProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Unexpected Server Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleWishListProducts()
  }, [])

  useEffect(() => {
    if (updateProducts === true) {
      handleWishListProducts()
      setUpdateProducts(false)
    }
  }, [updateProducts])

  // Simulate data loading
  React.useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title?.length > maxLength ? title.slice(0, maxLength) + '...' : title
  };

  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item)

  }

  const handleQuickViewClose = () => { setQuickView(false) }
  const handleProductClick = (item) => {
    router.push(`/product/${item.slug}`)
  };

  const handleWishList = async (item) => {
    const userId = localStorage.getItem('uuid');
    const userToken = localStorage.getItem('userToken');

    setOpenSnakeBar(true);

    if (isInWishList(item._id)) {
      // Remove from local storage
      removeFromList(item._id);

      // Remove from UI instantly
      setWishlistProducts(prev => prev.filter(p => p._id !== item._id));

      setWishlistMessage('Removed from wishlist');
    } else {
      addToList(item._id);
      setWishlistMessage('Added to wishlist');

      // Optional: instantly add product for guest mode
      if (!userId || !userToken) {
        setWishlistProducts(prev => [...prev, item]);
      }
    }

    // Sync with backend if user logged in
    if (userId && userToken) {
      const api = `${url}/api/v1/web-users/wishlist/${userId}`;
      try {
        await axios.put(api, { productId: item._id }, {
          headers: {
            Authorization: userToken,
            'Content-Type': 'application/json',
          }
        });

        // Fetch fresh list from server to ensure it's synced
        const response = await axios.get(api, {
          headers: { Authorization: userToken }
        });
        if (response.status === 200) {
          setWishlistProducts(response.data.wishlist);
        }
      } catch (error) {
        console.error("Unexpected Server Error", error);
      }
    }
  };

  const handleCloseSnakeBar = () => {
    setOpenSnakeBar(false)
  }

  const handleActiveGrid = (grid) => {
    setActiveGrid(grid)
  }

  const [regPrice, setRegPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const handleOpennfoModal = (salePrice, regPrice) => {
    setIsInfoOpen(true);
    setSalePrice(salePrice)
    setRegPrice(regPrice)
  }

  const handleCloseInfoModal = () => {
    setIsInfoOpen(false);
    setSalePrice('')
    setRegPrice('')
  }

  const handleSideCartClose = () => {
    setCartSection(false)
  }

  const { showDeliveryMessage } = useGlobalContext();
  const wishlistRef = useRef()


  return (
    <div ref={wishlistRef} className='wish-list-main-container'>

      <div className='wish-list-heading-container'>
        <h3 className='wish-list-main-heading'>Favorite Products</h3>

        <div className='mobile-view-wishlist-card-grid-select'>
          <div className={`mob-wish-list-single-col-container ${activeGrid === 'single-col' ? 'active-wishlist-single-box' : ''}`}>
            <div className={`mobile-view-wishlist-card-grid-single-col ${activeGrid === 'single-col' ? 'grid-active' : ''}`} onClick={() => { handleActiveGrid('single-col') }}></div>
          </div>
          <div className={`mobile-wish-list-dual-col-contianer ${activeGrid === 'dual-col' ? 'active-wishlist-dual-box' : ''}`}>
            <div className='mobile-view-wishlist-card-grid-dual-col' onClick={() => handleActiveGrid('dual-col')}>
              <div className={`mobile-view-wishlist-card-grid-dual-col-inner ${activeGrid !== 'single-col' ? 'active-dual-col' : ''}`}></div>
              <div className={`mobile-view-wishlist-card-grid-dual-col-inner ${activeGrid !== 'single-col' ? 'active-dual-col' : ''}`}></div>
            </div>
          </div>
        </div>

      </div>

      <div className={`${wishlistProducts?.length === 0 ? 'wish-listed-empty-products' : 'wish-listed-products'} `}>

        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <ProductCardShimmer key={index} />)
        ) : wishlistProducts?.length === 0 ? (
          <div className='empty-wishlist'>
            <Image src={'/icons/wishlist.svg'} width={60} height={60} alt='no items' />
            <h3>No items in your wishlist</h3>
          </div>
        ) : (
          wishlistProducts.map((item, index) => {
            return (
              <ProductCardTwo
                key={index}
                slug={item.slug}
                singleProductData={item}
                maxWidthAccordingToComp={"100%"}
                justWidth={'100%'}
                showOnPage={true}
                showExtraLines={true}
                percent={'12%'}
                colTwo={activeGrid === 'single-col'}
                tagIcon={item.productTag ? item.productTag : heart}
                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                mainImage={`${item?.image?.image_url}`}
                productCardContainerClass="product-card"
                ProductSku={item.sku}
                tags={item.sale_tag}
                ProductTitle={truncateTitle(item.name, maxLength)}
                allow_back_order={item?.allow_back_order}
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
                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                productUid={item.uid}
                productTag={item.product_tag}
              />
            );
          })
        )}
      </div>

      <div className={`wishlist-mobile-cards ${activeGrid === 'single-col' ? 'single-col' : 'two-col'}`}>
        {loading ? (
          <ProductCardShimmer width={'100%'} />
        ) : wishlistProducts?.length === 0 ? (
          <div className='empty-wishlist'>
            <Image src={'/icons/wishlist.svg'} width={60} height={60} alt='no items' />
            <h3>No items in your wishlist</h3>
          </div>
        ) : (
          wishlistProducts.map((item, index) => {
            return (
              <ProductCardTwo
                key={index}
                slug={item.slug}
                singleProductData={item}
                maxWidthAccordingToComp={"100%"}
                justWidth={'100%'}
                showOnPage={true}
                showExtraLines={true}
                percent={'12%'}
                tagIcon={item.productTag ? item.productTag : heart}
                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                mainImage={`${item?.image?.image_url}`}
                productCardContainerClass="product-card"
                ProductSku={item.sku}
                tags={item.sale_tag}
                ProductTitle={truncateTitle(item.name, maxLength)}
                allow_back_order={item?.allow_back_order}
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
                handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                colTwo={activeGrid === 'single-col' ? false : true}
                productTag={item.product_tag}

              />
            );
          })
        )}

      </div>



      <QuickView
        setQuickViewProduct={quickViewProduct}
        quickViewShow={quickViewClicked}
        quickViewClose={handleQuickViewClose}
      />

      <SideCart
        isCartOpen={cartSection}
        handleCloseSideCart={handleSideCartClose}
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



      {showDeliveryMessage && (
        <DisableDelivery parentRef={wishlistRef} />
      )}
    </div>
  )
}

export default WishListClient
