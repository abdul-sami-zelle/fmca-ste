import React, { useEffect, useState } from 'react'
import './Favorites.css'
import ProductCardTwo from '@/UI/Components/ProductCardTwo/ProductCardTwo'
import QuickView from '@/UI/Components/QuickView/QuickView'
import heart from '../../../../../Assets/icons/heart-vector.png';
import { useList } from '@/context/wishListContext/wishListContext';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { url } from '@/utils/api';
import axios from 'axios';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import ProductCardShimmer from '@/UI/Components/Loaders/productCardShimmer/productCardShimmer';
import Image from 'next/image';

const Favorites = ({ data, setloader }) => {
  const [loading, setLoading] = useState(false)

  const [quickViewClicked, setQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState({})
  const maxLength = 50;

  const params = useParams()
  const id = params.id;

  const [userToken, setUserToken] = useState('');
  useEffect(() => {
    const getToken = localStorage.getItem('userToken');
    if (getToken) {
      setUserToken(getToken)
    }
  }, [])


  // Simulate data loading
  useEffect(() => {
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

  // wish list
  // const { addToList, removeFromList, isInWishList } = useList()
  const { addToList, removeFromList, isInWishList } = useList()
  const [wishlistMessage, setWishlistMessage] = useState('')
  const [openSnakeBar, setOpenSnakeBar] = useState(false);


  const handleWishList = async (item) => {

    setOpenSnakeBar(true)
    if (isInWishList(item._id)) {
      removeFromList(item._id);
      setWishlistMessage('Removed from wishlist')

    } else {
      addToList(item._id)
      setWishlistMessage('added to wishlist')
    }

    const api = `${url}/api/v1/web-users/wishlist/${id}`;

    try {
      setloader(true)
      const response = await axios.put(api, { productId: item._id }, {
        headers: {
          Authorization: userToken,
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 200) {
        setloader(false)
      }
    } catch (error) {
      setloader(false);
      console.error("UnExpected Server Error", error);
    }
  }

  const handleCloseSnakeBar = () => {
    setOpenSnakeBar(false)
  }

  return (
    <div className="favorites-main-container">
      
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => <ProductCardShimmer key={index} />)
        ) : data?.length === 0 ? (
          <div className='empty-wishlist-in-fav'>
            <Image src={'/icons/wishlist.svg'} width={60} height={60} alt='empty wishlist icon' />
            <h3>No items in your wishlist</h3>
          </div>
        ) : (
          <div className='favorites-cards-container'>
          {data.map((item, index) => {
            return (
              <ProductCardTwo
                key={index}
                slug={item.slug}
                singleProductData={item}
                maxWidthAccordingToComp={"100%"}
                tagIcon={item.productTag ? item.productTag : heart}
                tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                mainImage={`${item.image.image_url}`}
                productCardContainerClass="product-card"
                ProductSku={item.sku}
                tags={item.sale_tag}
                ProductTitle={truncateTitle(item.name, maxLength)}
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
            );
          })}

      </div>
        )}

      <QuickView
        setQuickViewProduct={quickViewProduct}
        quickViewShow={quickViewClicked}
        quickViewClose={handleQuickViewClose}
      />

      <SnakBar
        message={wishlistMessage}
        openSnakeBarProp={openSnakeBar}
        setOpenSnakeBar={setOpenSnakeBar}
        onClick={handleCloseSnakeBar}
      />
    </div>
  )
}

export default Favorites