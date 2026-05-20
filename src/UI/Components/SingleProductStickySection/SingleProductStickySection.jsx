import React, { useRef, useState, useEffect } from 'react';
import './SingleProductStickySection.css';
import './SingleProductShimmer.css'
import { Link, useParams } from 'react-router-dom';
// Sticky Slider Images

// Assets
import redHeart from '../../../Assets/icons/red-heart.png'
import filledHeart from '../../../Assets/icons/filled-heart.png';
import minus from '../../../Assets/icons/minus.png';
import heartIcon from '../../../Assets/icons/red-heart.png'
import plus from '../../../Assets/icons/plus.png';
import { MdLocalShipping } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import { FaShareSquare } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaPlus, FaWindowMinimize } from "react-icons/fa6";

// Components
import WhatWeOffer from '../WhatWeOffer/WhatWeOffer';
import SingleProductFAQ from '../SingleProductFAQ/SingleProductFAQ';
import AlsoNeed from '../AlsoNeed/AlsoNeed';
import CartSidePannel from '../Cart-side-section/CartSidePannel';
import FinancingOptions from '../FinancingOptions/FinancingOptions';
import SizeVariant from '../SizeVariant/SizeVariant';
import DeliveryOptions from '../DeliveryOptions/DeliveryOptions';
import Breadcrumb from '../../../Global-Components/BreadCrumb/BreadCrumb';
import RatingReview from '../starRating/starRating';

// Alice Slider
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

// functions and context
import { useCart } from '../../../context/cartContext/cartContext';
import { formatedPrice, url } from '../../../utils/api';
import axios from 'axios';
import { useList } from '../../../context/wishListContext/wishListContext';
import { useProductPage } from '../../../context/ProductPageContext/productPageContext';
import { IoChevronForward } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import { useGlobalContext } from '../../../context/GlobalContext/globalContext';
import ShareProduct from '../ShareProduct/ShareProduct';
import LocationPopUp from '../LocationPopUp/LocationPopUp';
import { isArray } from 'lodash';

const SingleProductStickySection = ({ productData }) => {

  const {
    setSingleProductData,
    setSelectedVariationUid,
    findObjectByUID,
    setSelectedVariationData,
    selectedVariationData
  } = useProductPage();

  const { slug } = useParams()
  const [getBySlug, setGetBySlug] = useState({})

  const getProductDataWithSlug = async (slug) => {
    const api = `/api/v1/products/get-by-slug/`
    try {
      const response = await axios.get(`${url}${api}${slug}`)
      const temporaryProduct = response.data.products[0] || {};
      setGetBySlug(temporaryProduct)
    } catch (error) {
      console.error("Error Fetching fetching data with slug", error);
    }
  }

  // Effect to fetch data if user came directly via link
  useEffect(() => {
    if (!productData || Object.keys(productData).length === 0 || !('images' in productData)) {
      getProductDataWithSlug(slug);
    }
    setSingleProductData(productData)
    setSelectedVariationUid(productData?.default_variation)
    setSelectedVariationData(findObjectByUID(productData?.default_variation, productData?.variations));

  }, [productData, slug]);

  const [product, setProduct] = useState(
    Object.keys(productData || {}).length > 0 && productData.images !== undefined
      ? productData
      : getBySlug
  );

  useEffect(() => {

    if (
      Object.keys(productData || {}).length > 0 &&
      productData.images !== undefined &&
      productData !== product
    ) {
      setProduct(productData);
    } else if (!productData || Object.keys(productData).length === 0 || !productData.images) {
      setProduct(getBySlug);
    }
  }, [productData, slug, getBySlug, product])

  useEffect(() => { }, [product])

  const {
    addToCart,
    decreamentQuantity,
    increamentQuantity,
    removeFromCart,
    addToCart0,
    cartProducts
  } = useCart();

  const [cartSection, setCartSection] = useState(false);
  const [isProtectionCheck, setIsProtectionCheck] = useState(true)

  const [quantity, setQuantity] = useState(1)
  const increaseLocalQuantity = () => {
    setQuantity(quantity + 1);
  }

  const decreaseLocalQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  }

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value)
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const mobCarouselRef = useRef(null);

  const handleThumbnailClickk = (index) => {
    setActiveIndex(index);
    carouselRef.current.slideTo(index); // Slide to the selected thumbnail
  };

  const handleMobThumbnailClickk = (index) => {
    setMobileActiveIndex(index);
    mobCarouselRef.current.slideTo(index); // Slide to the selected thumbnail
  };

  const handleNextSlide = () => {
    const totalItems = product.type === 'variable'
      ? selectedVariationData?.images.length
      : product?.images.length;

    const newIndex = activeIndex === totalItems - 1 ? 0 : activeIndex + 1;

    setActiveIndex(newIndex);
    carouselRef.current.slideTo(newIndex); // Slide to the next thumbnail
  };

  const handleMobNextSlide = () => {
    const totalItems = product.type === 'variable'
      ? selectedVariationData?.images.length
      : product?.images.length;

    const newIndex = mobileActiveIndex === totalItems - 1 ? 0 : mobileActiveIndex + 1;

    setMobileActiveIndex(newIndex);
    mobCarouselRef.current.slideTo(newIndex); // Slide to the next thumbnail
  };

  const handlePrevSlide = () => {
    const totalItems = product.type === 'variable'
      ? selectedVariationData?.images.length
      : product?.images.length;

    const newIndex = activeIndex === 0 ? totalItems - 1 : activeIndex - 1;

    setActiveIndex(newIndex);
    carouselRef.current.slideTo(newIndex); // Slide to the previous thumbnail
  };

  const handleMobPrevSlide = () => {
    const totalItems = product.type === 'variable'
      ? selectedVariationData?.images.length
      : product?.images.length;

    const newIndex = mobileActiveIndex === 0 ? totalItems - 1 : mobileActiveIndex - 1;

    setMobileActiveIndex(newIndex);
    mobCarouselRef.current.slideTo(newIndex); // Slide to the previous thumbnail
  };

  // sticky behavior scrip
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (leftSectionRef.current && rightSectionRef.current) {
        const leftSection = leftSectionRef.current;
        const rightSection = rightSectionRef.current;

        const rightSectionBottom = rightSection.getBoundingClientRect().bottom;
        const leftSectionBottom = leftSection.getBoundingClientRect().bottom;

        if (rightSectionBottom < window.innerHeight) {
          leftSection.style.position = 'absolute';
          leftSection.style.bottom = '0';
        } else {
          leftSection.style.position = 'sticky';
          leftSection.style.bottom = 'auto';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Handle resizing of the window

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleAddToCartProduct = (product) => {
    setCartSection(true);
    addToCart(product, quantity, !isProtectionCheck);
  }
  const handleCartClose = () => {
    setCartSection(false)
    setQuantity(1)

  }
  const [variationData, setVariationData] = useState([])

  const [selectVariation, setSelectVariation] = useState(0);
  const handleSelectVariation = (value) => {
    setSelectVariation(value);
  }
  const [selectedUid, setSelectedUid] = useState(null);

  const handleSelectedVariationData = (value) => {
    setSelectedUid(value);

    const selectedIndex = productData?.variations?.findIndex(variation => variation?.uid === value);

    setVariationData(productData?.variations?.[selectedIndex]);

  };

  const [selectedColor, setSelectedColor] = useState();
  const handleSelectColor = (value) => {
    setSelectedColor(value);
  }

  const { addToList, removeFromList, isInWishList } = useList()
  const handleWishList = (item) => {

    if (isInWishList(item?.uid)) {
      removeFromList(item?.uid)
    } else {
      addToList(item)
    }
  }

  const { info, shippingMethods } = useGlobalContext();
  useEffect(() => {
  }, [shippingMethods])

  const [isSharePopup, setIsSharePopup] = useState(null);
  const [selectedProduct, SetSelectedProduct] = useState()
  const handleShareModal = (item) => {
    setIsSharePopup(item.uid)
    SetSelectedProduct(item)
  }

  const [searchLocation, setSearchLocation] = useState(false);
  const handleSearchModal = () => {
    setSearchLocation(true)
  }

  const handleCloseSearch = () => {
    setSearchLocation(false)
  }
  const [locationDetails, setLocationDetails] = useState({
    zipCode: '',
    city: '',
    state: '',
    country: ''
  });


  return (
    <>
      <div className='sticky-main-container-0'>
        <LocationPopUp
          searchLocation={searchLocation}
          handleCloseSearch={handleCloseSearch}
          setLocationDetails={setLocationDetails}
          locationDetails={locationDetails}
        />
        <div className="sticky-main-container">

          <div className='left-section'>
            <Breadcrumb
              sku={productData?.sku}
              productName={productData?.name}
              category={productData?.categories}
              categorySlug={productData?.categories?.[0]?.slug}
            />

            {Object.keys(product).length > 0 ? (
              <div className='single-product-alice-slider'>
                <p className='single-product-slider-main-image-stock-tag' >In Stock</p>
                <button className='single-product-arrow single-product-arrow-left' onClick={handlePrevSlide} >{/* <img src={arrowLeft} alt='left' /> */}
                  <IoChevronBack />
                </button>
                <AliceCarousel
                  ref={carouselRef}
                  activeIndex={activeIndex}
                  disableDotsControls
                  disableButtonsControls
                  items={
                    product.type === 'variable'
                      ? (selectedVariationData?.images || []).map((img, index) => (
                        <img
                          key={index}
                          src={`${url}${img.image_url}`}
                          className="single-product-slider-img"
                          alt={`Slide ${index}`}
                        />
                      ))
                      : (product?.images || []).map((item, index) => (
                        <img
                          key={index}
                          src={`${url}${item.image_url}`}
                          className="single-product-slider-img"
                          alt="simple"
                        />
                      ))
                  }
                  responsive={{
                    0: { items: 1 },
                    1024: { items: 1 },
                  }}
                />

                <div className="single-product-slider-thumbnails">
                  {product.type === 'variable' ? (
                    selectedVariationData?.images?.map((img, ind) => (
                      <div
                        key={ind}
                        className={`single-product-slider-thumbnail ${activeIndex === ind ? '' : 'single-product-slider-thumbnail-inactive'}`}
                        onClick={() => handleThumbnailClickk(ind)}
                      >
                        <TiArrowSortedDown size={30} color='#4478C5' className={activeIndex === ind ? 'show-arrow' : 'hide-arrow'} />
                        <img src={`${url}${img.image_url}`} alt={`Thumbnail ${ind}`} />
                      </div>
                    ))
                  ) : (
                    product?.images?.map((simpleImg, index) => (
                      <div
                        key={index}
                        className={`single-product-slider-thumbnail ${activeIndex === index ? '' : 'single-product-slider-thumbnail-inactive'}`}
                        onClick={() => handleThumbnailClickk(index)}
                      >
                        <TiArrowSortedDown size={30} color='#4478C5' className={activeIndex === index ? 'show-arrow' : 'hide-arrow'} />
                        <img src={`${url}${simpleImg.image_url}`} alt={`Thumbnail ${index}`} />
                      </div>
                    ))
                  )}
                </div>

                <button className='single-product-arrow single-product-arrow-right' onClick={handleNextSlide}>
                  <IoChevronForward />
                </button>
              </div>
            ) : (
              <div className='shimmer-single-product-main-image-slider-container'>
                <div className='shimmer-single-product-slider-main-image'></div>
                <div className='shimmer-single-product-main-slider-thumbnails-container'>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className='shimmer-single-product-slider-thumbnail'></div>
                  ))}
                </div>
              </div>
            )}

            <div className='left-section-delivery-options-main-container'>
              <span className='left-section-delivery-main-heading'>
                <p className='left-section-delivery-option'>Delivery options for: </p>
                <h3 className='left-section-delivery-zip' onClick={handleSearchModal}>{info.locationData.zipCode} {info.locationData.stateCode}</h3>
              </span>
              <div className='left-section-delivery-options-cards'>
                {shippingMethods && shippingMethods['shippingMethods'].map((item, index) => (
                  <div className='left-section-delivery-option-card'>
                    <div className='left-section-card-icon-container'>
                      {/* <img src={item.icon} alt='icon' /> */}
                      {item.id === "METHOD-3" ? <IoLocation size={32} /> : <MdLocalShipping size={32} />}
                    </div>
                    <div className='left-section-card-detail-container'>
                      <h3 className='left-section-card-heading'>{item.name}</h3>
                      <p className='left-section-card-short-description'>{item.description}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          <div className='right-section'>
            <div className='single-product-detail-container'>
              {Object.keys(product).length > 0 ? (
                <div className='single-page-product-name-anddetails'>

                  <h3 className='single-product-heading'>{product.name}</h3>
                  <p className='single-product-sku'>
                    SKU : {product.sku}
                  </p>
                  <div className='single-product-rating'>
                    <RatingReview rating={(product?.average_rating)} disabled={true} size={"20px"} />

                    <span className='single-product-share' onClick={() => handleShareModal(productData)}>
                      <FaShareSquare className='single-product-share-icon' size={20} />
                    </span>

                  </div>
                  {product?.type === "simple" ? <>
                    {product?.sale_price !== "" ? <div className='single-product-prices'>
                      <del className='single-product-old-price'>{formatedPrice(productData?.regular_price)}</del>
                      <h3 className='single-product-new-price'>{formatedPrice(productData?.sale_price)}</h3>
                    </div> : <div className='single-product-prices'>
                      <h3 className='single-product-new-price'>{formatedPrice(productData?.regular_price)}</h3>
                    </div>
                    }
                  </> : <>
                    {selectedVariationData?.sale_price !== "" ? <div className='single-product-prices'>
                      <del className='single-product-old-price'>{formatedPrice(selectedVariationData?.regular_price)}</del>
                      <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.sale_price)}</h3>
                    </div> : <div className='single-product-prices'>
                      <h3 className='single-product-new-price'>{formatedPrice(product?.regular_price)}</h3>
                    </div>
                    }
                  </>}

                  <span className='single-product-shipping'>
                    <p className='single-product-installment-price-price'>$9/month for 6 months - Total $ 199.00 </p>
                    <p>Get it between July 27 - July 31'</p>
                  </span>
                  <div className='single-product-frame-color'>
                    <SizeVariant
                      productType={product.type}
                      productData={product.variations}
                      attributes={product.attributes}
                      selectedColor={selectedColor}
                      selectVariation={selectVariation}
                      handleSelectColor={handleSelectColor}
                      handleSelectVariation={handleSelectVariation}
                      handleSelectedVariationData={handleSelectedVariationData}
                    />
                  </div>

                  <div className='add-cart-or-add-items-div'>
                    <div className='item-count'>
                      <button className={`minus-btn ${product.quantity === 1 ? 'disabled' : ''}`} onClick={decreaseLocalQuantity} disabled={product.quantity === 1}>
                        {/* <img src={minus} alt='minus btn' /> */}
                        <FaWindowMinimize size={18} className='minus-icon' />
                      </button>

                      <input
                        type='number'
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <button className='plus-btn' onClick={increaseLocalQuantity}>
                        {/* <img src={plus} alt='plus btn' /> */}
                        <FaPlus size={18} className='plus-icon' />
                      </button>
                    </div>
                    
                    <img src={isInWishList(product.uid) ? filledHeart : redHeart} alt='red-heart-icon' className='red-heart-icon' onClick={(e) => { e.stopPropagation(); handleWishList(product) }} />
                    <button
                      className={`add-to-cart-btn ${isLoading ? 'loading' : ''}`}
                      onClick={() => {
                        handleClick();
                        addToCart0(product, variationData, !isProtectionCheck ? 1 : 0, quantity)
                        handleAddToCartProduct(product);
                      }
                      }>
                      {isLoading ? 'Loading...' : 'Add To Cart'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className='shimmer-single-product-detail-sections'>
                  <div className='shimmer-single-product-name-sec'>
                    <div className='shimmer-single-product-name'></div>
                    <div className='shimmer-single-product-name-two'></div>
                  </div>
                  <div className='shimmer-single-product-sku'></div>
                  <div className='shimmer-single-product-rating'></div>
                  <div className='shimmer-single-product-price'></div>

                  <div className='shimmer-single-product-color-sec'>
                    <div className='shimmer-single-product-color-text'></div>
                    <div className='shimmer-single-product-color-box'></div>
                  </div>

                  <div className='shimmer-single-product-color-sec'>
                    <div className='shimmer-single-product-filter-text'></div>
                    <div className='shimmer-single-product-filter-box'></div>
                  </div>

                  <div className='shimmer-add-to-card-container'>
                    <div className='shimmer-quantity-container'></div>
                    <div className='shimmer-wishlist-icon'></div>
                    <div className='shimmer-add-to-cart-button'></div>
                  </div>

                </div>
              )}

              {Object.keys(product).length > 0 ? (
                <FinancingOptions />
              ) : (
                <div className='shimmer-financing-option'>
                  <div className='shimmer-financing-cards-sec'>
                    <div className='shimmer-financing-card'></div>
                    <div className='shimmer-financing-card'></div>
                    <div className='shimmer-financing-card'></div>
                  </div>
                  <div className='shimmer-financing-card-button'></div>
                </div>
              )}
              {product.may_also_need && product.may_also_need.length > 0 ? <AlsoNeed productsUid={product.may_also_need} /> : <></>}
 
              {Object.keys(product).length > 0 ? (
                <WhatWeOffer key={"single-protection"} isProtected={isProtectionCheck} setIsProtected={setIsProtectionCheck} />
              ) : (
                <div className='shimmer-what-we-offer-main'>
                  <div className='shimmer-what-we-offer-heading'></div>
                  <div className='shimmer-what-we-offer-card'></div>
                </div>
              )}
              {/* <DeliveryOptions /> */}
              <SingleProductFAQ description={product.description} />
            </div>
          </div>
        </div>
        <CartSidePannel
          cartData={cartProducts}
          addToCartClicked={cartSection}
          handleCartSectionClose={handleCartClose}
          setAddToCartClick={setCartSection}
          removeFromCart={removeFromCart}
          decreamentQuantity={decreamentQuantity}
          increamentQuantity={increamentQuantity}
        />
      </div>

      <div className='mobile-view-sticky-main-container'>

        <div className='mobile-view-single-product-slider'>

          <h3 className='mobile-view-product-name'>
            {product.name}
          </h3>
          <p className='mobile-view-product-sku'>
            SKU: {product.sku}
          </p>
          <div className='mobile-view-price-and-favorite-div'>
            <div className='old-and-new-price'>
              {productData?.type === "simple" ? <>
                {productData?.sale_price !== "0=" ? <div className='single-product-prices'>
                  <del className='single-product-old-price'>{formatedPrice(productData?.regular_price)}</del>
                  <h3 className='single-product-new-price'>{formatedPrice(productData?.sale_price)}</h3>
                </div> : <div className='single-product-prices'>
                  <h3 className='single-product-new-price'>{formatedPrice(productData?.regular_price)}</h3>
                </div>
                }
              </> : <>
                {selectedVariationData?.sale_price !== "0=" ? <div className='single-product-prices'>
                  <del className='single-product-old-price'>{formatedPrice(selectedVariationData?.regular_price)}</del>
                  <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.sale_price)}</h3>
                </div> : <div className='single-product-prices'>
                  <h3 className='single-product-new-price'>{formatedPrice(product?.regular_price)}</h3>
                </div>
                }
              </>}
            </div>
            <img src={heartIcon} alt='heart' />
          </div>

          <div className='mobile-view-single-product-rating'>
            <RatingReview rating={(product?.average_rating)} disabled={true} size={"12px"} />

          </div>

          <div className='mobile-view-single-product-slider-main-section'>

            <button
              className='mobile-single-product-slider-arrow mobile-single-product-arrow-left'
              onClick={handleMobPrevSlide}
            >
              <IoChevronBack />
            </button>

            <div className='mobile-view-single-product-slider-main-image'>

              <div className='mobile-view-product-tags'>
                <h3>In stock</h3>
                <h3>Clarence Sale</h3>
              </div>

              <AliceCarousel
                ref={mobCarouselRef}
                activeIndex={mobileActiveIndex}
                disableDotsControls
                disableButtonsControls
                items={
                  product.type === 'variable'
                    ? (selectedVariationData?.images || []).map((img, index) => (
                      <img
                        key={index}
                        src={`${url}${img.image_url}`}
                        className="single-product-slider-img"
                        alt={`Slide ${index}`}
                      />
                    ))
                    : (product?.images || []).map((item, index) => (
                      <img
                        key={index}
                        src={`${url}${item.image_url}`}
                        className="single-product-slider-img"
                        alt="simple"
                      />
                    ))
                }
                responsive={{
                  0: { items: 1 },
                  1024: { items: 1 },
                }}
              />
            </div>

            <div className='mobile-view-slider-thumb-images'>
              {product.type === 'variable' ? (
                selectedVariationData?.images?.map((img, ind) => (
                  <div
                    key={ind}
                    className={`single-product-slider-thumbnail ${mobileActiveIndex === ind ? '' : 'single-product-slider-thumbnail-inactive'}`}
                    onClick={() => handleMobThumbnailClickk(ind)}
                  >

                    <img src={`${url}${img.image_url}`} alt={`Thumbnail ${ind}`} />

                  </div>
                ))
              ) : (
                product.images?.map((simpleImg, index) => (
                  <div
                    key={index}
                    className={`single-product-slider-thumbnail ${mobileActiveIndex === index ? '' : 'single-product-slider-thumbnail-inactive'}`}
                    onClick={() => handleMobThumbnailClickk(index)}
                  >
                    <img src={`${url}${simpleImg.image_url}`} alt={`Thumbnail ${index}`} />
                  </div>
                ))
              )}
            </div>
            <button
              className='mobile-single-product-slider-arrow mobile-single-product-arrow-right'
              onClick={handleMobNextSlide}
            >
              <IoChevronForward />
            </button>
          </div>

        </div>
        <div className='mobile-view-single-product-details'>
          <div className='mobile-view-color-variant'>
            <SizeVariant
              productType={product.type}
              productData={product.variations}
              attributes={product.attributes}
              selectedColor={selectedColor}
              selectVariation={selectVariation}
              handleSelectColor={handleSelectColor}
              handleSelectVariation={handleSelectVariation}
              handleSelectedVariationData={handleSelectedVariationData}
            />
          </div>

          <div className='mobile-product-count-and-add-to-cart'>

            <div className='mobile-product-count'>

              <button className={`mobile-minus-btn ${product.quantity === 1 ? 'disabled' : ''}`} onClick={decreaseLocalQuantity} disabled={product.quantity === 1}>
                <img src={minus} alt='minus btn' />
              </button>

              <p>{quantity}</p>

              <button className='mobile-plus-btn' onClick={increaseLocalQuantity}>
                <img src={plus} alt='plus btn' />
              </button>
            </div>

            <button
              className={`mobile-add-to-cart-btn ${isLoading ? 'loading' : ''}`}
              onClick={() => {
                handleClick();
                addToCart0(product, variationData, !isProtectionCheck ? 1 : 0, quantity)
                handleAddToCartProduct(product);
              }
              }>
              {isLoading ? 'Loading...' : 'Add To Cart'}
            </button>
          </div>
          <FinancingOptions />
          <SingleProductFAQ />






        </div>
      </div>
      <ShareProduct
        isSharePopup={isSharePopup}
        setIsSharePopup={setIsSharePopup}
        selectedProduct={selectedProduct}
      />
    </>
  );
};

export default SingleProductStickySection;