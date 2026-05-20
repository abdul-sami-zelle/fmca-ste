'use client'

import React, { useEffect, useRef, useState } from 'react'
import './Cart.css'
import CartMainImage from '@/UI/Components/Cart-Components/CartMainImage/CartMainImage';
import CartProducts from '@/UI/Components/Cart-Components/Cart-Products/CartProducts';
import { IoIosArrowDown } from "react-icons/io";
import axios from 'axios'
import { useCart } from '@/context/cartContext/cartContext';
import ProductCardShimmer from '@/UI/Components/Loaders/productCardShimmer/productCardShimmer';
import { useList } from '@/context/wishListContext/wishListContext';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import { formatedPrice, getAdjustedPrice, url } from '../../utils/api';
import QuickView from '@/UI/Components/QuickView/QuickView';
import FinancingModal from '@/UI/Modals/FinancingModal/FinancingModal';
import AppointmentModal from '@/Global-Components/AppointmentModal/AppointmentModal';
import ProductCardTwo from '@/UI/Components/ProductCardTwo/ProductCardTwo';
import { useAppointment } from '@/context/AppointmentContext/AppointmentContext';
import { useRouter } from 'next/navigation';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import LocationPopUp from '@/UI/Components/LocationPopUp/LocationPopUp';
import SideCart from '@/UI/Components/Cart-side-section/SideCart';
import ZipModal from '@/UI/Modals/ZipModal/ZipModal';
import MiniToggleSwitch from '@/Global-Components/MiniToggler/miniToggler';
import { IoInformationCircleOutline } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';





const Cart = () => {
  const [isZipUpdateOpen, setIsZipUpdateOpen] = useState(true)
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const {
    shippingMethods,
    info,
    zipCode,
    handleInputChange,
    handleButtonClick,
    totalTax,
    calculateTotalTax,
    selectedOption,
    getShippingMethods,
    setSelectedShippingMethods,
    CalculateGrandTotal,
    wrongZip, setWrongZip,
    wrongZipMessage,
    handleZipWarningClose,
    zipLoading,
    showWhiteGlove,
    setShowWhiteGlove,
    whiteGloveValue,
    setWhiteGloveValue,
    showFAssembly,
    setShowFAssembly,
    fAssemblyValue,
    setFAssemblyValue,
    isDeliveryAllowed,
  } = useGlobalContext();


  const {
    subTotal,
    subTotal0,
    savings,
    isCartProtected,
    cartProducts,
    isProfessionalAssembly,
    cartSection,
    setCartSection,
    shippingHandlingValue,
    furnitureAssemblyValue,
    handleCartProtected,

  } = useCart();

  const [isChecked, setIsChecked] = useState(false);



  const handleZipInput = () => {
    setIsZipUpdateOpen(!isZipUpdateOpen)
  }

  const handleCouponInput = () => {
    setIsCouponOpen(!isCouponOpen)
  }

  const [latestProducts, setLatestProducts] = useState([]);
  const [noProduct, setNoProduct] = useState(false);



  useEffect(() => {
    if (shippingMethods) {
      getShippingMethods(subTotal, shippingMethods['shippingMethods']);
    }
  }, []);

  useEffect(() => {
    if (shippingMethods) {
      getShippingMethods(subTotal, shippingMethods['shippingMethods']);
      setIsStarted(!isStarted);
    }
  }, [subTotal, shippingMethods]); // Dependency array for changes in subTotal or shippingMethods

  useEffect(() => {
    if (shippingMethods) {
      getShippingMethods(subTotal, shippingMethods['shippingMethods']);
    }
  }, [isStarted])

  useEffect(() => { setSelectedShippingMethods(null) }, [info])

  const payCards = ['/Assets/icons/mastercard-1.png', '/Assets/icons/visa-1.png', '/Assets/icons/discover-1.png', '/Assets/icons/ae-1.png', '/Assets/icons/paypal-1.png'];

  const router = useRouter();
  const [quickViewProduct, setQuickViewProduct] = useState({})
  const [quickViewClicked, setQuickView] = useState(false);
  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item)
  }

  const handleQuickViewClose = () => {
    setQuickView(false);
  }

  const navigateToCheckout = () => {
    router.push("/check-out");
  }

  const {
    addToList,
    removeFromList,
    isInWishList
  } = useList()

  const handleWishList = (item) => {
    if (isInWishList(item.uid)) {
      removeFromList(item.uid);

    } else {
      addToList(item)
    }
  }

  // Apply Financing Modal
  const [applyFinancing, setApplyFinancing] = useState(false);
  const handleOpenFinancingModal = () => {
    setApplyFinancing(true);
  }
  const handleCloseFinancingModal = () => {
    setApplyFinancing(false)
  }

  useEffect(() => {
    if (applyFinancing) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [applyFinancing])

  // Appointment Modal
  const { setAppointmentPayload } = useAppointment()
  const [selectedTab, setSelectedTab] = useState(1);
  const [appointmentModal, setAppointmentModal] = useState(false)
  const handleAppointments = () => {
    setAppointmentModal(true);
  }

  const handleCloseAppointmentModal = () => {
    setAppointmentModal(false)
    setSelectedTab(1)
    setAppointmentPayload({
      serviceType: '',
      selectedCategories: [],
      selectedStore: {},
      otherDetails: 'Customer has sensitive skin',
      selectedDate: '',
      selectedSlot: '',
      details: {
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        associate: ''
      }
    })
  }

  const [errorMessage, setErrorMessage] = useState('Something went wrong! Please try again later.');
  const [snakebarOpen, setSnakebarOpen] = useState(false);

  const handleOpenSnakeBar = () => {
    setSnakebarOpen(true);
  }
  const handleProductClick = (item) => {
    router.push(`/product/${item.slug}`);
  };

  const [searchLocation, setSearchLocation] = useState(false);
  const handleLocationModal = () => {
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

  const handleCloseSideCart = () => {
    setCartSection(false)
  }

  const { showDeliveryMessage } = useGlobalContext()
  const cartMainRef = useRef(null);



  return (
    <div ref={cartMainRef} className='cart-main-container'>
      {/* <CartMainImage /> */}
      <div className='cart-body'>
        <div className={`cart-products-section ${cartProducts?.products?.length === 0 ? 'cart-products-section-full-width' : ''}`}>
          <CartProducts handleLocationModal={handleLocationModal} />
        </div>
        <div className={`cart-order-summery-section ${cartProducts?.products?.length === 0 ? 'hide-order-summary' : ''}`}>
          <div className='cart-order-summery-inner-section'>
            <h3 className='cart-order-summary-heading'>Order Summary</h3>
            <div className='cart-order-summary-price-details'>

              {selectedOption?.id !== 'METHOD-3' && <div className='cart-order-summary-zip-code'>
                <span className='cart-order-summary-zip-code-heading'>
                  {/* <p>Calculated for:</p> */}
                  {/* <h3 onClick={handleZipInput}>{info?.locationData?.state} {info?.locationData?.stateCode} <IoIosArrowDown className={`cart-order-summary-zip-arrow ${isZipUpdateOpen ? 'cart-order-summary-zip-arrow-rotate' : ''}`} size={20} /> </h3> */}
                  <h3 onClick={handleZipInput}>Zip Code <IoIosArrowDown className={`cart-order-summary-zip-arrow ${isZipUpdateOpen ? 'cart-order-summary-zip-arrow-rotate' : ''}`} size={15} /> </h3>
                </span>
                <div className={`cart-order-summary-zip-code-input-div ${isZipUpdateOpen ? 'show-zip-code-update-input' : ''}`} style={{ display: "inline-flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
                  <div className='cart-order-summary-zip-code-input-and-button'>
                    <input
                      type='text'
                      placeholder='Zip Code'
                      className='cart-summary-update-zip-input'
                      value={zipCode}
                      onChange={handleInputChange}
                    />
                    <button className='cart-summary-update-zip-btn' onClick={async () => { await handleButtonClick(); }}>
                      {zipLoading && <div className='loader_2' style={{ background: '#FFF' }}></div>}
                      {zipLoading ? 'Wait..' : 'Update'}
                    </button>
                  </div>
                  <span style={{
                    lineHeight: "11px",
                    fontSize: "11px",
                    fontStyle: "italic",
                    margin: "4px 0 0 0",
                    padding: "0",
                    color: "var(--orange-outline)"
                  }}>Delivery is charged as per zipcode.</span>
                </div>
              </div>}




              <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title'>Subtotal</p>
                <p className='cart-order-summary-price-detail-single-item-price'>{formatedPrice(subTotal0)}</p>
              </div>
              {savings > 0 && (
                <div className='cart-order-summary-price-detail-save-discount'>
                  <p>Savings</p>
                  <p style={{ color: "var(--tertiary-color)" }} >-{formatedPrice(savings)}</p>
                </div>
              )}
              {/* {isCartProtected ? ( */}
              {cartProducts?.products?.length > 1 && <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title' style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {/* Protect Entire Order */}
                  Premium Protection Plan
                  <span>
                    <MiniToggleSwitch checked={isDeliveryAllowed ? false : isCartProtected} isDeliveryAllowed={isDeliveryAllowed}
                      onChange={isDeliveryAllowed ? undefined : cartProducts?.products?.length > 1 ? handleCartProtected : undefined} />
                  </span>
                </p>
                <p className='cart-order-summary-price-detail-single-item-price'>{isCartProtected ? formatedPrice(199) : "$0.00"}</p>
              </div>}
              {/* ) : (
                <></>
              )} */}
              {isProfessionalAssembly ? (
                <div className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title ' style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>White Glove <BsInfoCircle className='info_icon_cart' onClick={() => { setShowWhiteGlove(true) }} /></p>
                  <p className='cart-order-summary-price-detail-single-item-price'>{formatedPrice(199)}</p>
                </div>
              ) : (
                <></>
              )}

              {!isProfessionalAssembly && selectedOption?.id !== 'METHOD-3' ? (
                <div className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title' style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>Furniture Assembly <BsInfoCircle className='info_icon_cart' onClick={() => { setShowFAssembly(true) }} /></p>
                  <p className='cart-order-summary-price-detail-single-item-price'>{formatedPrice(furnitureAssemblyValue)}</p>
                </div>
              ) : (
                <></>
              )}


              {

              }




              <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title' style={{ lineHeight: "13px" }}>

                  {(selectedOption?.cost === 0 && selectedOption?.id === 'METHOD-1') ? <>
                    Delivery Charged
                    <br />
                    {/* <span style={{
                      lineHeight: "10px",
                      fontSize: "10px",
                      fontStyle: "italic",
                      fontWeight: "500",
                      margin: "0",
                      padding: "0",
                      color: "var(--orange-outline)"
                    }}>Free Delivery Promotion Applied</span> */}
                  </> :
                    (selectedOption?.id === 'METHOD-3') ? `${selectedOption?.name}` :
                      "Delivery Charged"}

                  {/* {selectedOption?.name} */}

                </p>

                <p
                  className='cart-order-summary-price-detail-single-item-price'
                  style={{ textAlign: "end", lineHeight: "12px" }}
                >
                  {(selectedOption?.cost === 0 && selectedOption?.id === 'METHOD-1') ? (
                    <>
                      <del style={{ opacity: "0.5" }}>
                        {formatedPrice(Number(selectedOption?.sale_cost) || 0)}
                      </del>{" "}
                      <span style={{ color: "#7C0000", fontWeight: "bolder" }}>FREE</span>
                      <br />
                      <span
                        style={{
                          lineHeight: "11px",
                          fontSize: "11px",
                          fontStyle: "italic",
                          margin: "0",
                          padding: "0",
                          color: "var(--orange-outline)",
                        }}
                      >
                        Free Delivery Promotion Applied. <br />Mileage restrictions may apply.
                      </span>
                    </>
                  ) : (selectedOption?.cost === 0 && selectedOption?.id !== 'METHOD-1') ? (
                    ""
                  ) : (
                    formatedPrice(Number(selectedOption?.cost) || 0)
                  )}
                </p>


                {/* <p className='cart-order-summary-price-detail-single-item-price' style={{ textAlign: "end", lineHeight: "12px" }}>
                  {(selectedOption?.cost === 0 && selectedOption?.id === 'METHOD-1') ? <>
                    <del style={{ opacity: "0.5" }}>{formatedPrice(selectedOption?.sale_cost)}</del> <span style={{ color: "#7C0000", fontWeight: "bolder" }}>FREE</span>
                    <br />
                    <span style={{
                      lineHeight: "11px",
                      fontSize: "11px",
                      fontStyle: "italic",
                      margin: "0",
                      padding: "0",
                      color: "var(--orange-outline)"
                    }}>Free Delivery Promotion Applied. <br />Mileage restrictions may apply.</span>
                  </> :
                    (selectedOption?.cost === 0 && selectedOption?.id !== 'METHOD-1') ? "" :
                      formatedPrice(selectedOption?.cost)}
                </p> */}
              </div>
              {selectedOption?.id !== 'METHOD-3' && <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title'>Shipping & Handling</p>
                <p className='cart-order-summary-price-detail-single-item-price'><del style={{ opacity: "0.5" }}>{formatedPrice(shippingHandlingValue)}</del> $0.00</p>
              </div>}
              <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title'>{`Tax (${totalTax?.tax_name})`}</p>
                <p className='cart-order-summary-price-detail-single-item-price'>{totalTax ? formatedPrice(calculateTotalTax((subTotal + (selectedOption?.cost || 0) +(!isProfessionalAssembly && selectedOption?.id !== 'METHOD-3' ? furnitureAssemblyValue : 0)), parseFloat(totalTax?.tax_value))) : 0}</p>
              </div>

            </div>
            <div className='cart-order-summary-total'>
              <div className='cart-order-summary-price-detail-single-item-total-container'>
                <p className='cart-order-summary-price-detail-single-item-title-total'>Total</p>
                <p className='cart-order-summary-price-detail-single-item-price-count'>{formatedPrice(CalculateGrandTotal())}</p>
              </div>
            </div>
            <div className='order-summary-coupon-div'>
              <p onClick={handleCouponInput}>Add Coupon Code <IoIosArrowDown className={`cart-order-summary-coupon-arrow ${isCouponOpen ? 'cart-order-summary-coupon-arrow-rotate' : ''}`} size={15} /></p>
              <div className={`cart-order-summary-coupon-input-div ${isCouponOpen ? 'show-coupon-update-input' : ''}`}>
                <div className='cart-order-summary-coupon-input-and-button'>
                  <input type='text' placeholder='Coupon Code' className='cart-summary-update-coupon-input' />
                  <button className='cart-summary-update-coupon-btn'>Apply</button>
                </div>
              </div>
            </div>
            <button
              onClick={navigateToCheckout}
              disabled={isDeliveryAllowed}
              style={{ opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer' }}
              className='cart-summary-proceed-btn'>
              Proceed to Checkout
            </button>
            <div className='payment-card-container'>
              <h3 className='payment-cards-heading'>Securely accepted at checkout</h3>
              <div className='payment-cards-inner-container'>
                {payCards && payCards.map((item, index) => (
                  <img src={item} key={index} alt='payment card' className='payment-card' />
                ))}
              </div>
            </div>
            <div className='financing-months-range-container'>
              <h3 className='financing-month-range-heading'>${getAdjustedPrice(subTotal0)}/week for 12 months</h3>
              <button disabled={isDeliveryAllowed} style={{ opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer' }} className='financing-month-range-apply-button' onClick={handleOpenFinancingModal}>
                Apply for Financing
              </button>
              <h3 className='financing-month-range-heading'>Cart will be shared with our home furnishing consultant.</h3>
              <button className='financing-month-range-apply-button' onClick={handleAppointments}>
                Complete in Store
              </button>
            </div>
          </div>
        </div>
      </div>

      {latestProducts && latestProducts?.length > 0 && (
        <div className='cart-related-products-display-section'>
          <h3>You May Also Like</h3>
          <div className='cart-related-products-slider-main-div'>

            {!noProduct && (
              latestProducts && latestProducts?.length > 0 ? (
                <SwiperSlider
                  slidesData={latestProducts}
                  renderSlide={(item, index) => (
                    <div key={index} className='cart-latest-product-cards-container'>
                      <ProductCardTwo
                        key={index}
                        slug={item.slug}
                        singleProductData={item}
                        maxWidthAccordingToComp={"100%"}
                        justWidth={'100%'}
                        percent={'12%'}
                        showOnPage={true}
                        tagIcon={item.productTag ? item.productTag : '/Assets/icons/heart-vector.png'}
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
                        productTag={item.product_tag}
                      />
                    </div>
                  )}
                  showDots={true}
                  showArrows={false}
                  spaceBetween={15}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 4 },
                  }}
                />
              ) : (
                <div className='cart-page-also-like-cards-shimmer-contianer'>
                  <div className='cart-page-also-like-desktop-shimmer'>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <ProductCardShimmer width={'100%'} />
                    ))}
                  </div>

                  <div className='cart-page-also-like-mobile-shimmer'>
                    {Array.from({ length: 1 }).map((_, index) => (
                      <ProductCardShimmer width={'100%'} />
                    ))}
                  </div>
                </div>

              )
            )}
            {/* {latestProducts && latestProducts?.length > 0 ? (
              <SwiperSlider
                slidesData={latestProducts}
                renderSlide={(item, index) => (
                  <div key={index} className='cart-latest-product-cards-container'>
                    <ProductCardTwo
                      key={index}
                      slug={item.slug}
                      singleProductData={item}
                      maxWidthAccordingToComp={"100%"}
                      justWidth={'100%'}
                      percent={'12%'}
                      showOnPage={true}
                      tagIcon={item.productTag ? item.productTag : '/Assets/icons/heart-vector.png'}
                      tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                      mainImage={`${item.image.image_url}`}
                      productCardContainerClass="product-card"
                      ProductSku={item.sku}
                      tags={item.tags}
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
                    />
                  </div>
                )}
                showDots={true}
                showArrows={false}
                spaceBetween={15}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 4 },
                }}
              />
            ) : (
              <div className='cart-page-also-like-cards-shimmer-contianer'>
                <div className='cart-page-also-like-desktop-shimmer'>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardShimmer width={'100%'} />
                  ))}
                </div>

                <div className='cart-page-also-like-mobile-shimmer'>
                  {Array.from({ length: 1 }).map((_, index) => (
                    <ProductCardShimmer width={'100%'} />
                  ))}
                </div>
              </div>

            )} */}
          </div>
        </div>
      )}

      <div className='space-between-checkout-and-related-products'></div>
      <div className={`mobile-total-save-and-checkout-button ${showDeliveryMessage ? 'apply-pading-bottom' : ''}`}>
        <div className='mobile-total-and-save'>
          <p className='mobile-total-text'>Total</p>
          <p className='mobile-total-text-ammount'>{formatedPrice(CalculateGrandTotal())}</p>
        </div>
        <div className='mobile-total-and-save'>
          <p className='mobile-you-save-text'>You Saved</p>
          <p className='mobile-you-save-text'>{formatedPrice(savings)}</p>
        </div>
        <button onClick={navigateToCheckout} disabled={cartProducts.products?.length === 0 || isDeliveryAllowed} className={`mobile-proceed-to-checkout-button ${cartProducts.products?.length === 0 || isDeliveryAllowed ? 'disable-checkout-button' : ''}`}>
          Proceed to Checkout
        </button>
      </div>

      {/* {isDeliveryAllowed && (
        <div ref={notDeliveryMessageRef} className={`zip-not-under-delivery-area-message-contianer ${isFixed ? 'make-sticky' : ''}`}>
          <span className='zip-not-underdelivery-message'>
            <h3>Sorry for Inconvenience </h3>
            <p>We're currently not offering shipping to Arizona State</p>
          </span>

          <button className='bottom-zip-update-button'>Change Zip Code</button>
        </div>
      )} */}

      {showDeliveryMessage && (
        <DisableDelivery parentRef={cartMainRef} />
      )}




      <QuickView setQuickViewProduct={quickViewProduct} quickViewShow={quickViewClicked} quickViewClose={handleQuickViewClose} />
      <FinancingModal
        applyFinancing={applyFinancing}
        handleCloseModal={handleCloseFinancingModal}
      />
      <AppointmentModal
        showAppointMentModal={appointmentModal}
        setAppointmentModal={setAppointmentModal}
        handleCloseModal={handleCloseAppointmentModal}
        setErrorMessage={setErrorMessage}
        snakebarOpen={snakebarOpen}
        setSnakebarOpen={setSnakebarOpen}
        handleOpenSnakeBar={handleOpenSnakeBar}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      <SideCart
        isCartOpen={cartSection}
        handleCloseSideCart={handleCloseSideCart}
      />

      <LocationPopUp
        searchLocation={searchLocation}
        handleCloseSearch={handleCloseSearch}
        setLocationDetails={setLocationDetails}
        locationDetails={locationDetails}
      />

      <ZipModal
        showMessage={wrongZip}
        errorDetail={wrongZipMessage}
        footerMessage={'Wrong Zip Code'}
        closeModal={handleZipWarningClose}
      />

      <ZipModal
        showMessage={showWhiteGlove}
        errorDetail={whiteGloveValue}
        footerMessage={'Wrong Zip Code'}
        closeModal={() => {
          setShowWhiteGlove(false)
        }}
      />

      <ZipModal
        showMessage={showFAssembly}
        errorDetail={fAssemblyValue}
        footerMessage={'Wrong Zip Code'}
        closeModal={() => {
          setShowFAssembly(false)
        }}
      />
    </div>
  )
}
export default Cart