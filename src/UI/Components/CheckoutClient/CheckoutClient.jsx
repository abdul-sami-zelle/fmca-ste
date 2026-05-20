'use client'

import React, { useState, useRef } from 'react'
import './CheckoutClient.css';
import PaymentMethod from '@/UI/Components/Summary-Components/PaymentMethod/PaymentMethod';
import { useMyOrders } from '@/context/orderContext/ordersContext';
import Loader from '@/UI/Components/Loader/Loader';
import { useCart } from '@/context/cartContext/cartContext';
import { formatedPrice, truncateTitle, url, useDisableBodyScroll } from '../../../utils/api';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import { IoIosArrowDown } from "react-icons/io";
import DeliveryInfo from '@/UI/Components/DeliveryInfo/DeliveryInfo';
import axios from 'axios';
import TermsConditionsModal from '@/Global-Components/TermsConditionsModal/termsConditionModal';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import MessageModal from '@/UI/Modals/MessageModal/MessageModal';
import { useRouter } from 'next/navigation';
import MiniToggleSwitch from '@/Global-Components/MiniToggler/miniToggler';
import { BsInfoCircle } from "react-icons/bs";
import ZipModal from '@/UI/Modals/ZipModal/ZipModal';
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';


const CheckoutClient = () => {

  const {
    orderPayload,
    setOrderPayload,
    handlePaymentInfo,
    sendProducts,
    selectedTab,
    handleTabOpen,
    isLoader,
    showThankyou,
    warningMessage,
    showWarning,
    setShowWarning,
    errorDetails,
  } = useMyOrders();

  const {
    zipCode,
    handleInputChange,
    handleButtonClick,
    totalTax,
    calculateTotalTax,
    selectedOption,
    CalculateGrandTotal,
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
    savings,
    cartProducts,
    cartUid,
    subTotal0,
    isCartProtected,
    isProfessionalAssembly,
    shippingHandlingValue,
    furnitureAssemblyValue,
    handleCartProtected
  } = useCart();

  const router = useRouter()
  if (typeof window !== 'undefined' && cartProducts?.products?.length === 0) {
    router.replace('/cart');
    return null; // Prevent rendering
  }

  const deliveryInfoRef = useRef(null);

  const handleDeliveryFormSubmit = () => {
  };

  const handlePaymentSubmit = () => { }



  const [isTermsConditionsOpen, setIsTermsConditionsOpen] = useState(false);


  const handleCloseTermsConditionsModal = () => {
    setIsTermsConditionsOpen(false);
  }

  const checkoutSectionsData = [
    { id: 1, name: 'Order Information', navOp: 'delivery' },
    { id: 2, name: 'Payments', navOp: 'payment-method' },
  ]

  const [currentId, setCurrentId] = useState(0)
  const [isLoading, setIsLoading] = useState(false);


  const moveToNextTab = async () => {
    if (deliveryInfoRef.current) {
      setIsLoading(true)
      const isValid = await deliveryInfoRef.current.validateAndSubmit(); // Ensure it's awaited

      if (!isValid) {
        setIsLoading(false)
        return; // Stop here if validation fails
      }
      handleTabOpen(1);
      setIsLoading(false)
    }
  };


  const handleContinueToPayment = async () => {

    if (deliveryInfoRef.current) {
      setIsLoading(true)
      const isValid = deliveryInfoRef.current.validateAndSubmit();

      // if (!isValid) {
      //   setIsLoading(false)
      //   window.scrollTo({
      //     top: 0,
      //     behavior: 'smooth',
      //   });
      //   return; // Stop here if validation fails
      // }


      // setIsLoading(false)
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }

      handleTabOpen(1);
      try {
        const response = await axios.put(`${url}/api/v1/unused-cart/edit/${cartUid}`, { cart: cartProducts, checkout: orderPayload.billing });
        await new Promise((resolve) => setTimeout(resolve, 0)); // Ensures React processes state updates correctly
        // handleTabOpen(1);
        setIsLoading(false)
        return response.data;

      } catch (error) {
        console.error("Error updating cart:", error);
        setIsLoading(false)
        throw error; // Avoid calling setCartSection on error if not needed
      }
    }
  };

  const handleClickSave = () => {
    handlePaymentInfo();
    sendProducts();
  };

  const [isZipUpdateOpen, setIsZipUpdateOpen] = useState(true)
  const handleZipInput = () => {
    setIsZipUpdateOpen(!isZipUpdateOpen)
  }

  const isPaymentMethodFilled = () => orderPayload?.payment_method?.trim() !== "";
  const [showSnakeBar, setShowSnakeBar] = useState(false);
  const [snakeBarMessage, setSnakeBarMessage] = useState()
  const handleShowSnakeToust = (name) => {
    setShowSnakeBar(true)
    setSnakeBarMessage(name)
  }

  const handleCloseSnakeBar = () => {
    setShowSnakeBar(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPaymentMethodFilled()) {
      // Proceed with form submission
      handleClickSave();
    } else {
      setShowSnakeBar(true)
      handleShowSnakeToust("Please select a payment method!")
    }
  };

  const [showAll, setShowAll] = useState(false);
  const handleShowMore = () => {
    setShowAll(!showAll)
  }

  const handleCloseWarningModal = () => {
    setShowWarning(false)
  }

  const checkoutPageRef = useRef();
  const { showDeliveryMessage, info, setSearchLocation } = useGlobalContext()

  const subTotalValue = Number(subTotal) || 0;
  const assemblyValue = (!isProfessionalAssembly && selectedOption?.id !== 'METHOD-3') ? Number(furnitureAssemblyValue) || 0 : 0
  const taxRate = parseFloat(totalTax?.tax_value) || 0


  useDisableBodyScroll(showWarning)


  return (
    <div className='summary-main-container'>
      {isLoader && <Loader />}
      <div className='checkout-inputs-and-summary'>
        {!showThankyou &&
          <div className='summary-left-main-outer-container'>
            <div className='checkout-pages-toggle-nav'>
              {checkoutSectionsData.map((item, index) => (
                <div
                  onClick={() => {
                    index === 0 ?
                      handleTabOpen(index) :
                      moveToNextTab();
                  }}
                  className={`checkout-page-select-option-container ${selectedTab === index ? 'selected-option' : ''}`}
                  key={item.id}
                >
                  <h3>{item.name}</h3>

                  <label className='checkbox1'>
                    <input
                      type='checkbox'
                      checked={selectedTab === index}
                      readOnly
                    />
                    <span></span>
                  </label>


                </div>
              ))}
            </div>
            <div className='summary-left-section'>
              {
                selectedTab === 0 ?
                  <div className='shipping-details-and-coupen-show'>

                    <DeliveryInfo ref={deliveryInfoRef} onSubmit={handleDeliveryFormSubmit} />
                  </div> :

                  selectedTab === 1 ? <PaymentMethod onSubmit={handlePaymentSubmit} handleSubmitOrder={handleSubmit} />
                    : <></>
              }
            </div>
          </div>

        }

        {!showThankyou && <div className={` ${currentId === 1 ? 'summary-right-section' : currentId === 2 ? 'summery-right-section-according-payment' : 'summery-right-section-low-height'}`}>

          <div className='right-section-order-summary-main-container'>
            <h3 className='right-section-order-summary-main-heading'>Order Summary</h3>
            <div className='right-section-order-summary-products-container'>

              <div className='right-section-ordered-product-card'>
                {cartProducts?.products?.slice(0, showAll ? cartProducts?.products?.length : 2).map((items, index) => (
                  <div key={index} className='selected-products'>
                    <div className='selected-single-product'>
                      <img src={items?.outSource === true ? items.image.image_url : `${url}${items.image.image_url}`} alt='img' />
                      <div className='selected-product-containt'>
                        <span className='selected-product-name-and-price'>
                          <h3>{truncateTitle(items.name, 35)}</h3>
                        </span>

                        <div className='right-section-content-and-price'>
                          <div className='right-section-content'>
                            {items?.attributes && items?.attributes.map((item, index) => {
                              return (
                                <span key={index} className='selected-product-color'><p>{item?.options[0]?.name}</p></span>
                              )
                            })}
                          </div>

                          <div className='right-section-price'>
                            {items.sale_price === '' ? (
                              <p className='checkout-product-single-price'>{formatedPrice(items.regular_price)}</p>
                            ) : (
                              <div className='order-summary-prices-container' style={{ display: 'flex', flexDirection: 'column' }}>
                                <p>{formatedPrice(items.sale_price)}</p>
                                <del>{formatedPrice(items.regular_price)}</del>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='right-section-show-more-button-container'>
                {cartProducts?.products?.length > 2 && <p className='show-more-products-button' onClick={handleShowMore}> {showAll ? 'See Less' : ` See All ${cartProducts?.products?.length} Items`}</p>}
              </div>

              <div className='right-section-order-pricing-details'>

                {(selectedTab !== 1 && selectedOption?.id !== 'METHOD-3') && (
                  <div className='cart-order-summary-zip-code'>
                    <span className='cart-order-summary-zip-code-heading'>
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
                  </div>
                )}

                <div className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title'>Subtotal</p>
                  <p className='cart-order-summary-price-detail-single-item-price'>{formatedPrice(subTotal0)}</p>
                </div>
                {savings > 0 && (
                  <div className='cart-order-summary-price-detail-single-item'>
                    <p className='cart-order-summary-price-detail-single-item-title'>Savings</p>
                    <p className='cart-order-summary-price-detail-single-item-price' style={{ color: "var(--tertiary-color)" }} >-{formatedPrice(savings)}</p>
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


                <div className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title' style={{ lineHeight: "13px" }}>

                    {(selectedOption?.cost === 0 && selectedOption?.id === 'METHOD-1') ? <>
                      Delivery Charged
                      <br />
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

                </div>

                {selectedOption?.id !== 'METHOD-3' && <div className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title'>Shipping & Handling</p>
                  <p className='cart-order-summary-price-detail-single-item-price'><del style={{ opacity: "0.5" }}>{formatedPrice(shippingHandlingValue)}</del> $0.00</p>
                </div>}

                <div className='cart-order-summary-price-detail-single-item'>

                  <p className='cart-order-summary-price-detail-single-item-title'>{`Tax (${totalTax?.tax_name})`}</p>
                  <p className='cart-order-summary-price-detail-single-item-price'>{formatedPrice(calculateTotalTax(subTotalValue + assemblyValue + (selectedOption?.cost || 0) , taxRate))}</p>
                </div>
                



                <div className='desktop-total-and-continue'>
                  <div className='right-section-total-value'>
                    <p className='right-section-total-price-text-and-value'>Total</p>
                    <p className='right-section-total-price-text-and-value'>{formatedPrice(CalculateGrandTotal())}</p>
                  </div>

                  <div className='right-section-order-place-container'>
                    <label className='email-blast-label'>
                      <input
                        type="checkbox"
                        className='checkout-email-blast-checkbox'
                        checked={orderPayload.email_blast}
                        value={orderPayload.emailBlast}
                        // onChange={(e) => setEmailBlast(e.target.checked)}
                        onChange={(e) =>
                          setOrderPayload(prev => ({
                            ...prev,
                            email_blast: e.target.checked
                          }))
                        }
                        required
                      />
                      Opt into Receive Text and Emails Blasts.
                    </label>
                    <p>By placing this order I agree to the Furniture Mecca <span onClick={() => setIsTermsConditionsOpen(true)}>Terms & Conditions</span></p>
                    {
                      selectedTab === 0 ? <button onClick={handleContinueToPayment} disabled={isDeliveryAllowed} style={{ opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer' }} className='right-section-place-order-button'>Continue</button>
                        : <button onClick={handleSubmit} disabled={isDeliveryAllowed} style={{ opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer' }} className='right-section-place-order-button'>Place Your Order</button>
                    }
                  </div>
                </div>
              </div>

              <div className='checkout-total-and-continue-sticky'>
                <div className='right-section-total-value'>
                  <p className='right-section-total-price-text-and-value'>Total</p>
                  <p className='right-section-total-price-text-and-value'>{formatedPrice(CalculateGrandTotal())}</p>
                </div>

                <div className={`mob-terms-condition-and-procced-button-container ${showDeliveryMessage ? 'apply-margin-bottom' : ''}`}>
                  <span>
                    <p>By placing this order I agree to the Furniture Mecca</p>
                    <i onClick={() => setIsTermsConditionsOpen(true)}>Terms & Conditions</i>
                  </span>
                  {
                    selectedTab === 0 ? <button onClick={handleContinueToPayment} className='right-section-place-order-button'>Continue</button>
                      : <button onClick={handleSubmit} className='right-section-place-order-button'>Place Your Order</button>
                  }
                </div>

                {showDeliveryMessage && (
                  <div className='mobile-view-not-delivery-message'>
                    <p>We're not offering delivery to {info?.locationData?.zipCode}</p>
                    <button>Change Zip code</button>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>}
        {isLoading && <div className="cart_products_overlay">
          <div className="loader"></div>
        </div>}
      </div>

      <TermsConditionsModal
        openModal={isTermsConditionsOpen}
        closeModal={handleCloseTermsConditionsModal}
      />
      <SnakBar
        message={snakeBarMessage}
        openSnakeBarProp={showSnakeBar}
        setOpenSnakeBar={setShowSnakeBar}
        onClick={handleCloseSnakeBar}
      />
      <MessageModal
        showMessage={showWarning}
        message={warningMessage}
        errorDetail={errorDetails}
        footerMessage={'This is Footer'}
        closeModal={handleCloseWarningModal}
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

      {showDeliveryMessage && (
        <div className={`zip-not-under-delivery-area-message-contianer`}>
          <span className='zip-not-underdelivery-message'>
            {/* <h3>Sorry for Inconvenience </h3> */}
            <p>We're currently not offering shipping to {info?.locationData?.zipCode} State</p>
          </span>

          <button className='bottom-zip-update-button' onClick={() => setSearchLocation(true)}>Change Zip Code</button>
        </div>
        // <DisableDelivery  />
      )}

    </div>
  )
}

export default CheckoutClient