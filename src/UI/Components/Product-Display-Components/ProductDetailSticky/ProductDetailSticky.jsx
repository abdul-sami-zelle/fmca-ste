// import React, { use, useEffect, useRef, useState } from 'react'
// import './ProductDetailSticky.css'
// import ProductGallery from '../ProductGallery/ProductGallery'
// import ProductDimension from '../ProductDimenson/ProductDimension'
// import { useProductPage } from '../../../../context/ProductPageContext/productPageContext'
// import RatingReview from '../../starRating/starRating'
// import { FaShareSquare } from 'react-icons/fa'
// import { formatedPrice, truncateTitle, url, getDeliveryDate, useDisableBodyScroll } from '../../../../utils/api'
// import SizeVariant from '../../SizeVariant/SizeVariant'
// import { FaLocationDot, FaPlus, FaWindowMinimize } from 'react-icons/fa6'
// import { useList } from '../../../../context/wishListContext/wishListContext'
// import { SlCalender } from "react-icons/sl";

// import { SiAdguard } from "react-icons/si";
// import DimensionDetail from '../DimensionDetail/DimensionDetail'

// import { IoCallOutline, IoChatbubbleOutline } from "react-icons/io5";

// import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
// import ShareProduct from '../../ShareProduct/ShareProduct'
// import CartSidePannel from '../../Cart-side-section/CartSidePannel'
// import { useGlobalContext } from '../../../../context/GlobalContext/globalContext'
// import { PiStorefrontLight } from "react-icons/pi";
// import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
// import AppointmentModal from '../../../../Global-Components/AppointmentModal/AppointmentModal'
// import LocationPopUp from '../../LocationPopUp/LocationPopUp'
// import SnakBar from '../../../../Global-Components/SnakeBar/SnakBar'
// import { useAppointment } from '../../../../context/AppointmentContext/AppointmentContext';
// import { useCart } from '../../../../context/cartContext/cartContext'
// import { BsTruck } from "react-icons/bs";
// import ProductDisplayShimmer from '../ProductDisplayShimmers/ProductDisplayShimmer'
// import { usePathname, useRouter } from 'next/navigation'
// import useSWR from 'swr'
// import { fetcher } from '@/utils/Fetcher'
// import WhatIsCovered from '@/UI/Modals/WhatIsCovered/WhatIsCovered'
// import { useChatOpenContext } from '@/context/ChatbotContext/ChatbotContext'
// import { VscHeart, VscHeartFilled } from 'react-icons/vsc'
// import Image from 'next/image'



// const ProductDetailSticky = (
//   {
//     productData,
//     decreaseLocalQuantity,
//     quantity,
//     handleQuantityChange,
//     increaseLocalQuantity,
//     isLoading,
//     variationData,
//     setVariationData,
//     handleGalleryModal,
//     isSticky,
//     isCartLoading,
//     params,
//     setProductDetails,
//     showDRM,
//     dimensionModal,
//     showDesignRoomModal,
//     zoomIn,
//     setZoomIn,
//     stockCheck,
//   }) => {




//   const {
//     addToCart0,
//     cartSection,
//     setCartSection,
//   } = useCart();


//   const router = useRouter()
//   const { setAppointmentPayload } = useAppointment()
//   const [selectedTab, setSelectedTab] = useState(1);
//   const [slideIndex, setSlideIndex] = useState(null)


//   const { info, fetchAllstores, isDeliveryAllowed } = useGlobalContext();
//   const { handleOpenChatUsOnly } = useChatOpenContext()
//   const [panelShow, setPanelShow] = useState(false)

//   // Get Product Data from previous route or api
//   const {
//     setSingleProductData,
//     setSelectedVariationUid,
//     findObjectByUID,
//     setSelectedVariationData,
//     selectedVariationData
//   } = useProductPage();

//   const { slug } = use(params);
//   const [getBySlug, setGetBySlug] = useState({})

//   const getBySlugApi = slug ? `${url}/api/v1/products/get-by-slug/${slug}` : null;
//   const [getBySlugCount, setGetBySlugCount] = useState(0)

//   const { data: getBySlugData, error: getByErrorSlug, isLoading: getBySlugLoading } = useSWR(getBySlugApi, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     dedupingInterval: 1000 * 60 * 60 * 24 * 365
//   });

//   if (getByErrorSlug && getBySlugCount < 3) {
//     setTimeout(() => {
//       setGetBySlugCount(getBySlugCount + 1);
//     }, 1000)
//   }

//   useEffect(() => {
//     if (getBySlugData) {
//       const temporaryProduct = getBySlugData.products[0] || {};
//       setGetBySlug(temporaryProduct)
//     }
//   }, [getBySlugData])

//   // Effect to fetch data if user came directly via link
//   useEffect(() => {
//     setSingleProductData(productData)
//     setSelectedVariationUid(productData?.default_variation)
//     setSelectedVariationData(findObjectByUID(productData?.default_variation, productData?.variations));
//   }, [slug]);

//   const [product, setProduct] = useState(
//     Object.keys(productData || {}).length > 0 && productData.images !== undefined
//       ? productData
//       : getBySlug
//   );

//   useEffect(() => {
//     if (
//       Object.keys(productData || {}).length > 0 &&
//       productData.images !== undefined &&
//       productData !== product
//     ) {
//       setProduct(productData);
//     } else if (!productData || Object.keys(productData).length === 0 || !productData.images) {
//       setProduct(getBySlug);
//     }
//   }, [productData, slug, getBySlug])


//   // Share Product Modal
//   const [isSharePopup, setIsSharePopup] = useState(null);
//   const [selectedProduct, SetSelectedProduct] = useState()
//   const handleShareModal = (item) => {
//     setIsSharePopup(item.uid)
//     SetSelectedProduct(item)
//   }

//   // Variation Select and auto select
//   const [selectedColor, setSelectedColor] = useState();
//   const handleSelectColor = (value) => {
//     setSelectedColor(value);
//   }

//   const [selectVariation, setSelectVariation] = useState(0);
//   const handleSelectVariation = (value) => {
//     setSelectVariation(value);
//   }

//   const [selectedUid, setSelectedUid] = useState(null);
//   const handleSelectedVariationData = (value) => {
//     if (selectedUid === value) {
//       return;
//     }
//     setSelectedUid(value);

//     const selectedIndex = productData?.variations?.findIndex(variation => variation?.uid === value);

//     setVariationData(productData?.variations?.[selectedIndex]);
//   };

//   useEffect(() => {
//     setProductDetails((prev) => ({
//       ...prev,
//       color: variationData?.attributes?.find(item => item.type === 'color').options[0]?.name
//     }))
//   }, [])

//   useEffect(() => {
//     setProductDetails((prev) => ({
//       ...prev,
//       color: variationData?.attributes?.find(item => item.type === 'color').options[0]?.name
//     }))
//   }, [variationData])


//   // Protection Plan
//   const [isSingleProtectionChecked, setIsSingleProtectionChecked] = useState(false);
//   const [isProtected, setIsProtected] = useState(true)
//   const [protectionCheck, setProtectionCheck] = useState(false)

//   const handleProtection = (key, isChecked) => {
//     setProtectionCheck(!protectionCheck)
//     if (key === 'single-protection') {
//       setIsSingleProtectionChecked(isChecked);
//       setIsProtected(isSingleProtectionChecked)
//     }
//   };

//   const { addToList, removeFromList, isInWishList } = useList()

//   // const [zoomIn, setZoomIn] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });

//   const handleZoomImage = () => {
//     setZoomIn(!zoomIn);
//     if (!isClick) {
//       setPosition({ x: 0, y: 0 }); // Reset position when zooming out
//     }
//   };

//   const handleMouseDown = (e) => {
//     if (!zoomIn) return;
//     setDragging(true);
//     const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
//     const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
//     setStartPos({ x, y });
//   };

//   const handleMouseMove = (e) => {
//     if (!zoomIn || !dragging) return;
//     const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
//     const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;

//     const deltaX = x - startPos.x;
//     const deltaY = y - startPos.y;

//     setStartPos({ x, y });
//     setPosition((prev) => ({
//       x: prev.x + deltaX,
//       y: prev.y + deltaY,
//     }));
//   };


//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   const [showMiles, setShowMiles] = useState(false);
//   const milesData = [
//     { distance: '50 MILES' },
//     { distance: '100 MILES' },
//     { distance: '200 MILES' },
//   ]
//   const [miles, setMiles] = useState(milesData[0].distance);
//   const handleMilesDropdown = () => {
//     setShowMiles(true)
//   }

//   const handleCloseMiles = (e) => {
//     setShowMiles(false);
//   }

//   const [appointmentModal, setAppointmentModal] = useState(false);
//   const [serviceIndex, setServiceTypeIndex] = useState(null)
//   const handleShowAppointmentModal = () => {
//     setAppointmentModal(true);
//   }

//   const handleCloseAppointmentModal = () => {
//     setAppointmentModal(false)
//     setSelectedTab(1)
//     setServiceTypeIndex(null)
//     setAppointmentPayload({
//       serviceType: '',
//       selectedCategories: [],
//       selectedStore: {},
//       otherDetails: 'Customer has sensitive skin',
//       selectedDate: '',
//       selectedSlot: '',
//       details: {
//         firstName: '',
//         lastName: '',
//         email: '',
//         contact: '',
//         associate: ''
//       }
//     })
//   }

//   useEffect(() => {
//     document.body.style.overflow = appointmentModal ? 'hidden' : 'auto';
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [appointmentModal]);

//   const [showLocation, setShowLocation] = useState(false);
//   const [locationData, setLocationData] = useState();
//   const handleOpenLocationModal = () => {
//     setShowLocation(true);
//   }
//   const handleCloseLocationModal = () => {
//     setShowLocation(false);
//   }

//   const [addCartSticky, setAddCartSticky] = useState(false)
//   const cartDivRef = useRef(null);
//   useEffect(() => {
//     const handleScrollAddToCart = () => {
//       if (cartDivRef.current) {
//         const rect = cartDivRef.current.getBoundingClientRect();
//         setAddCartSticky(rect.top <= 0);
//       }
//     }
//     window.addEventListener('scroll', handleScrollAddToCart);
//     return () => window.removeEventListener('scroll', handleScrollAddToCart);
//   }, [cartDivRef]);
//   const [errorMessage, setErrorMessage] = useState('Something went wrong! Please try again later.');


//   const [showSnakeBar, setShowSnakeBar] = useState(false);
//   const [snakeBarMessage, setSnakeBarMessage] = useState()
//   const handleShowSnakeToust = (message) => {
//     setShowSnakeBar(true)
//     setSnakeBarMessage(message)
//   }


//   const handleWishList = async (item) => {

//     const userId = localStorage.getItem('uuid');
//     const getToken = localStorage.getItem('userToken');

//     setShowSnakeBar(true)
//     if (isInWishList(item._id)) {
//       removeFromList(item._id);
//       setSnakeBarMessage('Removed from wishlist')

//     } else {
//       addToList(item._id)

//       setSnakeBarMessage('added to wishlist')
//     }

//     if (userId && getToken) {
//       const api = `${url}/api/v1/web-users/wishlist/${userId}`;

//       try {
//         const response = await axios.put(api, { productId: item._id }, {
//           headers: {
//             Authorization: getToken,
//             'Content-Type': 'application/json',
//           }
//         });
//       } catch (error) {
//         console.error("UnExpected Server Error", error);
//       }
//     }
//   }

//   const handleCloseSnakeBar = () => {
//     setShowSnakeBar(false);
//   }

//   const [isProtectionCheck, setIsProtectionCheck] = useState(true)
//   const { eachProtectionValue } = useCart();
//   const [whatIsCoveredModa, setWhatIsCoveredModal] = useState(false);

//   const handleWhatIsCoveredModal = () => {
//     setWhatIsCoveredModal(true);
//   }

//   const handleCloseWhatIsCoveredModal = () => {
//     setWhatIsCoveredModal(false);
//   }

//   const pathname = usePathname()
//   const handleWhatsAppClick = () => {
//     const phoneNumber = '15402927702';
//     const message = `Hello, I am interested in this product! https://myfurnituremecca.com${pathname}`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

//     window.open(whatsappURL, '_blank');
//   };

//   const handleSidePanelOpen = () => {
//     setTimeout(() => { setPanelShow(true) }, 500)
//   }

//   const handleSideCartClose = () => {
//     setPanelShow(false)
//   }


//   const [showSideCart, setShowSideCart] = useState(false);
//   const handleCloseSideCart = () => {
//     setShowSideCart(false);
//   }

//   const handleAddProductIntoCart = (product) => {
//     addToCart0(product, selectedVariationData, !isProtected ? 1 : 0, quantity);
//     setTimeout(() => {

//       setShowSideCart(true)
//     }, 500)
//   }



//   useDisableBodyScroll(whatIsCoveredModa)

//   return (
//     <div className='product-detail-sticky-section-main-container'>


//       {Object.keys(product).length > 0 ? (
//         <div className='product-detail-sticky-gallery-and-detail'>

//           <div className='product-detail-product-gallery-section'>

//             <div className='mobile-view-slider-top-details'>
//               <h1>{product?.name}</h1>
//               <div className='product-detail-rating-and-share'>
//                 {product.type === 'simple' ? (
//                   <p>SKU : {product.sku}</p>
//                 ) : (
//                   <p>{selectedVariationData?.sku}</p>
//                 )}

//                 <span
//                   className='single-product-share'
//                   onClick={() => handleShareModal(productData)}
//                 >
//                   <FaShareSquare className='single-product-share-icon' size={20} />
//                 </span>
//               </div>
//               {product?.type === "simple" ? <>
//                 {product?.sale_price !== "" ? <div className='single-product-prices'>

//                   <h3 className='single-product-new-price'>{formatedPrice(productData?.sale_price)}</h3>
//                   <del className='single-product-old-price'>{formatedPrice(productData?.regular_price)}</del>
//                 </div> : <div className='single-product-prices'>
//                   <h3 className='single-product-new-price'>{formatedPrice(productData?.regular_price)}</h3>
//                 </div>
//                 }
//               </> : <>
//                 {selectedVariationData?.sale_price !== "" ? <div className='single-product-prices'>

//                   <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.sale_price)}</h3>
//                   <del className='single-product-old-price'>{formatedPrice(selectedVariationData?.regular_price)}</del>
//                 </div> : <div className='single-product-prices'>
//                   <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.regular_price)}</h3>
//                 </div>
//                 }
//               </>}

//               <RatingReview rating={(product?.rating_count)} disabled={true} size={"20px"} />

//             </div>

//             <ProductGallery
//               productData={product}
//               selectedVariationData={selectedVariationData}
//               productImages={product?.images}
//               zoomIn={zoomIn}
//               setZoomIn={setZoomIn}
//               dragging={dragging}
//               position={position}
//               handleMouseDown={handleMouseDown}
//               handleMouseMove={handleMouseMove}
//               handleMouseUp={handleMouseUp}
//               handleGalleryModal={handleGalleryModal}
//               setSlideIndex={setSlideIndex}
//               stockCheck={stockCheck}
//             />
//             <ProductDimension productData={product} slideIndex={slideIndex} dimensionModal={dimensionModal} showDesignRoomModal={showDesignRoomModal} showDrm={showDRM} handleGalleryModal={handleGalleryModal} handleZoom={handleZoomImage} zoomIn={zoomIn} setZoomIn={setZoomIn} variationData={selectedVariationData} />
//             {product?.weight_dimension && <DimensionDetail productData={product} handleGalleryModal={handleGalleryModal} />}

//           </div>

//           <div className='product-detail-product-info-section'>

//             <div className='product-detail-info-sticky'>
//               <div className='product-detail-name-and-rating-etc'>
            
//                 <h1>{product?.name}</h1>
//                 {/* <p>SKU : {product.sku}</p> */}
//                 {product?.type === "simple" ? (
//                   <p>SKU : {product.sku}</p>
//                 ) : (
//                   <p>SKU: {selectedVariationData?.sku}</p>
//                 )}

//                 <div className='product-detail-rating-and-share'>
//                   <RatingReview rating={(product?.rating_count)} disabled={true} size={"20px"} />
//                   <span
//                     className='single-product-share'
//                     onClick={() => handleShareModal(productData)}
//                   >
//                     <FaShareSquare className='single-product-share-icon' size={20} />
//                   </span>
//                 </div>

//                 {product?.type === "simple" ? <>
//                   {product?.sale_price !== "" ? <div className='single-product-prices'>
//                     <h3 className='single-product-new-price'>{formatedPrice(productData?.sale_price)}</h3>
//                     <del className='single-product-old-price'>{formatedPrice(productData?.regular_price)}</del>
//                   </div> : <div className='single-product-prices'>
//                     <h3 className='single-product-new-price'>{formatedPrice(productData?.regular_price)}</h3>
//                   </div>
//                   }
//                 </> : <>
//                   {selectedVariationData?.sale_price !== "" ? <div className='single-product-prices'>
//                     <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.sale_price)}</h3>
//                     <del className='single-product-old-price'>{formatedPrice(selectedVariationData?.regular_price)}</del>
//                   </div> : <div className='single-product-prices'>
//                     <h3 className='single-product-new-price'>{formatedPrice(selectedVariationData?.regular_price)}</h3>
//                   </div>
//                   }
//                 </>}
//               </div>
//             </div>

//             <div className='product-detail-other-info'>


//               <div className='single-product-frame-color'>
//                 <SizeVariant
//                   productType={product.type}
//                   product={product}
//                   productData={product.variations}
//                   attributes={product.attributes}
//                   selectedColor={selectedColor}
//                   selectVariation={selectVariation}
//                   handleSelectColor={handleSelectColor}
//                   handleSelectVariation={handleSelectVariation}
//                   handleSelectedVariationData={handleSelectedVariationData}
//                 />
//               </div>

//               <div className='add-to-cart-and-out-of-stock-message-container'>
//                 <div className='add-cart-or-add-items-div' ref={cartDivRef}>
//                   <div className='item-count'>
//                     <button className={`minus-btn ${stockCheck || isDeliveryAllowed  || productData?.status === 'discontinued' ? 'disable-quantity' : ''} ${product.quantity === 1 ? 'disabled' : ''}`} onClick={decreaseLocalQuantity} disabled={product.quantity === 1 || stockCheck || isDeliveryAllowed ||  productData?.status === 'discontinued'}>

//                       <FaWindowMinimize size={15} className='minus-icon' />
//                     </button>

//                     <input
//                       type='number'
//                       value={quantity}
//                       // readOnly={stockCheck}
//                       readOnly
//                       onChange={handleQuantityChange}
//                       className={stockCheck ? 'disable-quantity' : ''}
//                     />
//                     <button disabled={stockCheck || isDeliveryAllowed || productData?.status === 'discontinued'} className={`plus-btn ${stockCheck || isDeliveryAllowed ||  productData?.status === 'discontinued' ? 'disable-quantity' : ''}`} onClick={increaseLocalQuantity}>

//                       <FaPlus size={15} className='plus-icon' />
//                     </button>
//                   </div>
//                   <div
//                     className='product-details-add-to-wishlist-icon'
//                     onClick={(e) => { e.stopPropagation(); handleWishList(product) }}
//                     style={{ border: isInWishList(product.uid) ? '1px solid red' : '1px solid var(--orange-outline)' }}
//                   >
//                     {
//                       isInWishList(product?._id) ? (
//                         <VscHeartFilled
//                           size={25}
//                           style={{ color: 'var(--orange-fill)' }}
//                         />
//                       ) : (
//                         <VscHeart
//                           size={25}
//                           style={{ color: 'var(--orange-outline)' }}
//                         />
//                       )
//                     }
//                   </div>





//                   <button
//                     className={`add-to-cart-btn ${stockCheck || isDeliveryAllowed || productData?.status === 'discontinued' ? 'disable-add-to-cart' : ''} ${isLoading ? 'loading' : ''}`}
//                     disabled={stockCheck || isDeliveryAllowed || productData?.status === 'discontinued'}
//                     onClick={() => addToCart0(product, selectedVariationData, !isProtected ? 1 : 0, quantity)}
                  
//                   >
//                     {isCartLoading && <div className="loader_2"></div>}
//                     {isCartLoading ? ' Almost there...' : 'Add To Cart'}
//                   </button>
//                 </div>
//                 {stockCheck && <p className='out-of-stoc-message'>This product will be available in 5 to 6 weeks</p>}

//               </div>



//               {/* {product.may_also_need && product.may_also_need.length > 0 ? <AlsoNeed productsUid={product.may_also_need} /> : <></>} */}

//               <div className='get-in-timeline-offer'>
//                 <BsTruck size={21} color='var(--secondary-color)' />
//                 <div className='get-offer-details'>
//                   <h3 >Get it by <span style={{ fontWeight: "600", color: "var(--tertiary-color)" }}>{getDeliveryDate()}</span></h3>
//                   <p>
//                     Fully assembled & placed in your room, or in-store pickup.
//                   </p>
//                   <span className='location' onClick={handleOpenLocationModal}>
//                     <FaLocationDot size={17} color='var(--tertiary-color)' />
//                     <p>{info.locationData.zipCode} {info.locationData.stateCode}</p>
//                   </span>
//                 </div>
//               </div>

//               <div className='product-details-protection-plan-container'>
//                 <h3>Protect Your Investment</h3>
//                 <div className='product-details-protection-plan-details-and-add'>

//                   <div className='product-details-protection-plan'>
//                     <SiAdguard size={21} color='var(--secondary-color)' />

//                     <div className='product-details-info'>
//                       <p>5-Year Platinum Protection</p>

//                       <span>
//                         <p>+${eachProtectionValue}</p>
//                         <i onClick={handleWhatIsCoveredModal}>
//                           What's Covered
//                         </i>
//                       </span>

//                     </div>

//                   </div>

//                   {protectionCheck ? (
//                     <button
//                       onClick={() => handleProtection('single-protection', false)}
//                       className='product-detail-add-protection-plan-button'>
//                       Applied
//                     </button>
//                   ) : (
//                     <button
//                       disabled={isDeliveryAllowed}
//                       onClick={() => handleProtection('single-protection', true)}
//                       className='product-detail-add-protection-plan-button'>
//                       Add
//                     </button>
//                   )}


//                 </div>

//                 <div className='product-detail-chat-option-container'>
//                   <p>Product Question?</p>
//                   <button onClick={handleWhatsAppClick}>Send Us Your Query</button>
//                 </div>
//                 <p className='have-a-question-message'>Have a question about this product? Our team is here to help you with details, dimensions, delivery, or anything else you need to know before you buy.</p>

//               </div>

//               <div className='see-in-person-container'>

//                 <div className='see-it-in-person-head'>
//                   {/* <PiStorefrontLight size={20} color='var(--secondary-color)' /> */}
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 64 49"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                     className='near-store-svg'
//                   >
//                     <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--tertiary-color)" />
//                   </svg>
//                   <h3>See it in Person</h3>
//                 </div>

//                 <div className='see-it-in-person-body' onClick={handleCloseMiles}>

//                   <p>This collection is on display in 9 Stores</p>


//                 </div>

//                 <div className='see-it-in-person-book-appointment-container'>
//                   <SlCalender size={20} color='var(--tertiary-color)' />
//                   <p onClick={handleShowAppointmentModal}>MAKE AN APPOINTMENT</p>
//                 </div>



//               </div>
//               <div className='talk-with-expert-main-container'>
//                 <p>Talk with an Expert</p>
//                 <div className='talk-with-expert-options'>

//                   <a href='tel:2153521600'>
//                     <IoCallOutline size={18} color='var(--secondary-color)' />
//                     Call
//                   </a>

//                   <button onClick={handleOpenChatUsOnly} >
//                     <IoChatbubbleOutline size={18} color='var(--secondary-color)' />
//                     Chat
//                   </button>

//                   <button onClick={handleShowAppointmentModal} >
//                     <PiStorefrontLight size={18} color='var(--secondary-color)' />
//                     Visit
//                   </button>

//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       ) : (
//         <ProductDisplayShimmer />
//       )}






//       <div
//         className={`add-to-cart-sticky-section ${addCartSticky ? 'show-sticky-add-to-cart' : ''}`}
//         style={{ boxShadow: !isSticky ? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : 'none' }}
//       >
//         <div className='mobile-product-sticky-fixed-add-to-cart'>
//           <div className='mobile-sticky-product-sale-and-price'>
//             <h3 className='sticky-section-product-name'>{productData?.name ? truncateTitle(productData?.name, 23) : ''}</h3>
//             <span>
//               <h3>Sale</h3>
//               <p>{formatedPrice(productData?.sale_price)}</p>
//             </span>
//           </div>
//           <button
//             className={stockCheck ? 'disable-sticky-add-to-cart' : ''}
//             disabled={stockCheck}
//             onClick={() => addToCart0(productData, variationData, !isProtectionCheck ? 1 : 0, quantity)}
//           // onClick={() => {
//           //   addToCart0(productData, variationData, !isProtectionCheck ? 1 : 0, quantity);
//           //   handleSidePanelOpen();
//           //   // handleAddToCartProduct(productData);
//           //   // handleSubmitProduct(productData)
//           // }
//           // }
//           >
//             Add To Cart
//           </button>
//         </div>
//       </div>

//       <WhatIsCovered
//         showCoveredModal={whatIsCoveredModa}
//         handleCloseCoveredModal={handleCloseWhatIsCoveredModal}
//       />

//       <SnakBar
//         message={snakeBarMessage}
//         openSnakeBarProp={showSnakeBar}
//         setOpenSnakeBar={setShowSnakeBar}
//         onClick={handleCloseSnakeBar}
//       />

//       <ShareProduct
//         isSharePopup={isSharePopup}
//         setIsSharePopup={setIsSharePopup}
//         selectedProduct={selectedProduct}
//       />



//       <AppointmentModal
//         showAppointMentModal={appointmentModal}
//         setAppointmentModal={setAppointmentModal}
//         handleCloseModal={handleCloseAppointmentModal}
//         setErrorMessage={setErrorMessage}
//         snakebarOpen={showSnakeBar}
//         setSnakebarOpen={setShowSnakeBar}
//         handleOpenSnakeBar={handleShowSnakeToust}
//         selectedTab={selectedTab}
//         setSelectedTab={setSelectedTab}
//         serviceIndex={serviceIndex}
//         setServiceTypeIndex={setServiceTypeIndex}
//       />

//       <LocationPopUp
//         searchLocation={showLocation}
//         handleCloseSearch={handleCloseLocationModal}
//         locationDetails={locationData}
//         setLocationDetails={setLocationData}
//       />

//     </div>
//   )
// }

// export default ProductDetailSticky



'use client'

import React, { use, useEffect, useRef, useState } from 'react'
import './ProductDetailSticky.css'
import ProductGallery from '../ProductGallery/ProductGallery'
import ProductDimension from '../ProductDimenson/ProductDimension'
import { useProductPage } from '../../../../context/ProductPageContext/productPageContext'
import RatingReview from '../../starRating/starRating'
import { FaShareSquare } from 'react-icons/fa'
import { formatedPrice, truncateTitle, url, getDeliveryDate, useDisableBodyScroll } from '../../../../utils/api'
import SizeVariant from '../../SizeVariant/SizeVariant'
import { FaLocationDot, FaPlus, FaWindowMinimize } from 'react-icons/fa6'
import { useList } from '../../../../context/wishListContext/wishListContext'
import { SlCalender } from "react-icons/sl"
import { SiAdguard } from "react-icons/si"
import DimensionDetail from '../DimensionDetail/DimensionDetail'
import { IoCallOutline, IoChatbubbleOutline } from "react-icons/io5"
import ShareProduct from '../../ShareProduct/ShareProduct'
import { useGlobalContext } from '../../../../context/GlobalContext/globalContext'
import { PiStorefrontLight } from "react-icons/pi"
import AppointmentModal from '../../../../Global-Components/AppointmentModal/AppointmentModal'
import LocationPopUp from '../../LocationPopUp/LocationPopUp'
import SnakBar from '../../../../Global-Components/SnakeBar/SnakBar'
import { useAppointment } from '../../../../context/AppointmentContext/AppointmentContext'
import { useCart } from '../../../../context/cartContext/cartContext'
import { BsTruck } from "react-icons/bs"
import ProductDisplayShimmer from '../ProductDisplayShimmers/ProductDisplayShimmer'
import { usePathname, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { fetcher } from '@/utils/Fetcher'
import WhatIsCovered from '@/UI/Modals/WhatIsCovered/WhatIsCovered'
import { useChatOpenContext } from '@/context/ChatbotContext/ChatbotContext'
import { VscHeart, VscHeartFilled } from 'react-icons/vsc'
import axios from 'axios'

// Price display sub-component — never renders NaN
const PriceDisplay = ({ type, simpleProduct, variationData }) => {
  if (type === 'simple') {
    const hasDiscount = simpleProduct?.sale_price && simpleProduct.sale_price !== '';
    return (
      <div className='single-product-prices'>
        <h3 className='single-product-new-price'>
          {formatedPrice(hasDiscount ? simpleProduct.sale_price : simpleProduct?.regular_price)}
        </h3>
        {hasDiscount && (
          <del className='single-product-old-price'>
            {formatedPrice(simpleProduct?.regular_price)}
          </del>
        )}
      </div>
    );
  }

  // Variable product — guard against null variationData
  if (!variationData) {
    return (
      <div className='single-product-prices'>
        <div style={{
          width: '120px',
          height: '28px',
          background: 'var(--skeleton-color, #e0e0e0)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
      </div>
    );
  }

  const hasDiscount = variationData?.sale_price && variationData.sale_price !== '';
  return (
    <div className='single-product-prices'>
      <h3 className='single-product-new-price'>
        {formatedPrice(hasDiscount ? variationData.sale_price : variationData?.regular_price)}
      </h3>
      {hasDiscount && (
        <del className='single-product-old-price'>
          {formatedPrice(variationData?.regular_price)}
        </del>
      )}
    </div>
  );
};

const ProductDetailSticky = ({
  productData,
  decreaseLocalQuantity,
  quantity,
  handleQuantityChange,
  increaseLocalQuantity,
  isLoading,
  variationData,
  setVariationData,
  handleGalleryModal,
  isSticky,
  isCartLoading,
  params,
  setProductDetails,
  showDRM,
  dimensionModal,
  showDesignRoomModal,
  zoomIn,
  setZoomIn,
  stockCheck,
}) => {

  const { addToCart0, cartSection, setCartSection } = useCart();
  const router = useRouter();
  const { setAppointmentPayload } = useAppointment();
  const [selectedTab, setSelectedTab] = useState(1);
  const [slideIndex, setSlideIndex] = useState(null);

  const { info, isDeliveryAllowed } = useGlobalContext();
  const { handleOpenChatUsOnly } = useChatOpenContext();

  const {
    setSingleProductData,
    setSelectedVariationUid,
    findObjectByUID,
    setSelectedVariationData,
    selectedVariationData
  } = useProductPage();

  const { slug } = use(params);

  // ── Fallback SWR fetch (only used if productData was not passed from server) ──
  const [getBySlug, setGetBySlug] = useState({});
  const [getBySlugCount, setGetBySlugCount] = useState(0);
  const shouldFetchBySlug = !productData || Object.keys(productData).length === 0 || !productData.images;
  const getBySlugApi = shouldFetchBySlug && slug
    ? `${url}/api/v1/products/get-by-slug/${slug}`
    : null;

  const { data: getBySlugData, error: getByErrorSlug } = useSWR(getBySlugApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  });

  if (getByErrorSlug && getBySlugCount < 3) {
    setTimeout(() => setGetBySlugCount(getBySlugCount + 1), 1000);
  }

  useEffect(() => {
    if (getBySlugData) {
      const temporaryProduct = getBySlugData.products[0] || {};
      setGetBySlug(temporaryProduct);

      // Also populate context if we had to fetch client-side
      if (temporaryProduct?.uid) {
        setSingleProductData(temporaryProduct);
        setSelectedVariationUid(temporaryProduct?.default_variation);
        setSelectedVariationData(
          findObjectByUID(temporaryProduct?.default_variation, temporaryProduct?.variations)
        );
      }
    }
  }, [getBySlugData]);

  // ── Resolve which product object to actually render ──
  const [product, setProduct] = useState(
    productData && Object.keys(productData).length > 0 && productData.images
      ? productData
      : getBySlug
  );

  useEffect(() => {
    if (productData && Object.keys(productData).length > 0 && productData.images) {
      setProduct(productData);
    } else if (!productData || Object.keys(productData).length === 0 || !productData.images) {
      setProduct(getBySlug);
    }
  }, [productData, slug, getBySlug]);

  // ── Only re-sync context when slug changes, not on every render ──
  // Context is already pre-populated by the wrapper; this handles
  // client-side navigation to a different product slug
  const prevSlug = useRef(slug);
  useEffect(() => {
    if (prevSlug.current === slug) return;
    prevSlug.current = slug;
    if (!productData) return;
    setSingleProductData(productData);
    setSelectedVariationUid(productData?.default_variation);
    setSelectedVariationData(findObjectByUID(productData?.default_variation, productData?.variations));
  }, [slug]);

  // Share Product Modal
  const [isSharePopup, setIsSharePopup] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState();
  const handleShareModal = (item) => {
    setIsSharePopup(item.uid);
    setSelectedProduct(item);
  };

  // Variation Select
  const [selectedColor, setSelectedColor] = useState();
  const [selectVariation, setSelectVariation] = useState(0);
  const [selectedUid, setSelectedUid] = useState(null);

  const handleSelectColor = (value) => setSelectedColor(value);
  const handleSelectVariation = (value) => setSelectVariation(value);

  const handleSelectedVariationData = (value) => {
    if (selectedUid === value) return;
    setSelectedUid(value);
    const selectedIndex = productData?.variations?.findIndex(v => v?.uid === value);
    setVariationData(productData?.variations?.[selectedIndex]);
  };

  useEffect(() => {
    if (!variationData?.attributes) return;
    const colorAttr = variationData.attributes.find(item => item.type === 'color');
    if (!colorAttr) return;
    setProductDetails((prev) => ({
      ...prev,
      color: colorAttr.options[0]?.name
    }));
  }, [variationData]);

  // Protection Plan
  const [isProtected, setIsProtected] = useState(true);
  const [protectionCheck, setProtectionCheck] = useState(false);
  const [isSingleProtectionChecked, setIsSingleProtectionChecked] = useState(false);

  const handleProtection = (key, isChecked) => {
    setProtectionCheck(!protectionCheck);
    if (key === 'single-protection') {
      setIsSingleProtectionChecked(isChecked);
      setIsProtected(isSingleProtectionChecked);
    }
  };

  const { addToList, removeFromList, isInWishList } = useList();

  // Zoom / drag
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleZoomImage = () => {
    setZoomIn(!zoomIn);
    if (!zoomIn) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (!zoomIn) return;
    setDragging(true);
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
    setStartPos({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!zoomIn || !dragging) return;
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
    const deltaX = x - startPos.x;
    const deltaY = y - startPos.y;
    setStartPos({ x, y });
    setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
  };

  const handleMouseUp = () => setDragging(false);

  // Appointment
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [serviceIndex, setServiceTypeIndex] = useState(null);

  const handleShowAppointmentModal = () => setAppointmentModal(true);
  const handleCloseAppointmentModal = () => {
    setAppointmentModal(false);
    setSelectedTab(1);
    setServiceTypeIndex(null);
    setAppointmentPayload({
      serviceType: '',
      selectedCategories: [],
      selectedStore: {},
      otherDetails: 'Customer has sensitive skin',
      selectedDate: '',
      selectedSlot: '',
      details: { firstName: '', lastName: '', email: '', contact: '', associate: '' }
    });
  };

  useEffect(() => {
    document.body.style.overflow = appointmentModal ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [appointmentModal]);

  // Location
  const [showLocation, setShowLocation] = useState(false);
  const [locationData, setLocationData] = useState();
  const handleOpenLocationModal = () => setShowLocation(true);
  const handleCloseLocationModal = () => setShowLocation(false);

  // Sticky add to cart bar
  const [addCartSticky, setAddCartSticky] = useState(false);
  const cartDivRef = useRef(null);

  useEffect(() => {
    const handleScrollAddToCart = () => {
      if (cartDivRef.current) {
        const rect = cartDivRef.current.getBoundingClientRect();
        setAddCartSticky(rect.top <= 0);
      }
    };
    window.addEventListener('scroll', handleScrollAddToCart);
    return () => window.removeEventListener('scroll', handleScrollAddToCart);
  }, []);

  // Snackbar
  const [showSnakeBar, setShowSnakeBar] = useState(false);
  const [snakeBarMessage, setSnakeBarMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('Something went wrong! Please try again later.');

  const handleShowSnakeToust = (message) => {
    setShowSnakeBar(true);
    setSnakeBarMessage(message);
  };

  const handleCloseSnakeBar = () => setShowSnakeBar(false);

  // Wishlist
  const handleWishList = async (item) => {
    const userId = localStorage.getItem('uuid');
    const getToken = localStorage.getItem('userToken');
    setShowSnakeBar(true);
    if (isInWishList(item._id)) {
      removeFromList(item._id);
      setSnakeBarMessage('Removed from wishlist');
    } else {
      addToList(item._id);
      setSnakeBarMessage('Added to wishlist');
    }
    if (userId && getToken) {
      try {
        await axios.put(
          `${url}/api/v1/web-users/wishlist/${userId}`,
          { productId: item._id },
          { headers: { Authorization: getToken, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("UnExpected Server Error", error);
      }
    }
  };

  // Protection / What's covered modal
  const [isProtectionCheck, setIsProtectionCheck] = useState(true);
  const { eachProtectionValue } = useCart();
  const [whatIsCoveredModa, setWhatIsCoveredModal] = useState(false);
  const handleWhatIsCoveredModal = () => setWhatIsCoveredModal(true);
  const handleCloseWhatIsCoveredModal = () => setWhatIsCoveredModal(false);

  // WhatsApp
  const pathname = usePathname();
  const handleWhatsAppClick = () => {
    const phoneNumber = '15402927702';
    const message = `Hello, I am interested in this product! https://myfurnituremecca.com${pathname}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useDisableBodyScroll(whatIsCoveredModa);

  // ── activeVariation: context value with local fallback so first render is correct ──
  // selectedVariationData is pre-populated from wrapper, so this is just a safety net
  const activeVariation = selectedVariationData;

  return (
    <div className='product-detail-sticky-section-main-container'>

      {Object.keys(product || {}).length > 0 ? (
        <div className='product-detail-sticky-gallery-and-detail'>

          {/* ── GALLERY COLUMN ── */}
          <div className='product-detail-product-gallery-section'>

            {/* Mobile top details */}
            <div className='mobile-view-slider-top-details'>
              <h2>{product?.name}</h2>
              <div className='product-detail-rating-and-share'>
                {product.type === 'simple'
                  ? <p>SKU : {product.sku}</p>
                  : <p>SKU : {activeVariation?.sku}</p>
                }
                <span className='single-product-share' onClick={() => handleShareModal(productData)}>
                  <FaShareSquare className='single-product-share-icon' size={20} />
                </span>
              </div>

              <PriceDisplay
                type={product?.type}
                simpleProduct={productData}
                variationData={activeVariation}
              />

              <RatingReview rating={product?.rating_count} disabled={true} size={"20px"} />
            </div>

            <ProductGallery
              productData={product}
              selectedVariationData={activeVariation}
              productImages={product?.images}
              zoomIn={zoomIn}
              setZoomIn={setZoomIn}
              dragging={dragging}
              position={position}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              handleGalleryModal={handleGalleryModal}
              setSlideIndex={setSlideIndex}
              stockCheck={stockCheck}
            />

            <ProductDimension
              productData={product}
              slideIndex={slideIndex}
              dimensionModal={dimensionModal}
              showDesignRoomModal={showDesignRoomModal}
              showDrm={showDRM}
              handleGalleryModal={handleGalleryModal}
              handleZoom={handleZoomImage}
              zoomIn={zoomIn}
              setZoomIn={setZoomIn}
              variationData={activeVariation}
            />

            {product?.weight_dimension && (
              <DimensionDetail productData={product} handleGalleryModal={handleGalleryModal} />
            )}
          </div>

          {/* ── INFO COLUMN ── */}
          <div className='product-detail-product-info-section'>

            <div className='product-detail-info-sticky'>
              <div className='product-detail-name-and-rating-etc'>
                <h1>{product?.name}</h1>
                {product?.type === 'simple'
                  ? <p>SKU : {product.sku}</p>
                  : <p>SKU : {activeVariation?.sku}</p>
                }
                <div className='product-detail-rating-and-share'>
                  <RatingReview rating={product?.rating_count} disabled={true} size={"20px"} />
                  <span className='single-product-share' onClick={() => handleShareModal(productData)}>
                    <FaShareSquare className='single-product-share-icon' size={20} />
                  </span>
                </div>

                <PriceDisplay
                  type={product?.type}
                  simpleProduct={productData}
                  variationData={activeVariation}
                />
              </div>
            </div>

            <div className='product-detail-other-info'>

              <div className='single-product-frame-color'>
                <SizeVariant
                  productType={product.type}
                  product={product}
                  productData={product.variations}
                  attributes={product.attributes}
                  selectedColor={selectedColor}
                  selectVariation={selectVariation}
                  handleSelectColor={handleSelectColor}
                  handleSelectVariation={handleSelectVariation}
                  handleSelectedVariationData={handleSelectedVariationData}
                />
              </div>

              <div className='add-to-cart-and-out-of-stock-message-container'>
                <div className='add-cart-or-add-items-div' ref={cartDivRef}>

                  <div className='item-count'>
                    <button
                      className={`minus-btn ${stockCheck || isDeliveryAllowed || productData?.status === 'discontinued' ? 'disable-quantity' : ''}`}
                      onClick={decreaseLocalQuantity}
                      disabled={product.quantity === 1 || stockCheck || isDeliveryAllowed || productData?.status === 'discontinued'}
                    >
                      <FaWindowMinimize size={15} className='minus-icon' />
                    </button>

                    <input
                      type='number'
                      value={quantity}
                      readOnly
                      onChange={handleQuantityChange}
                      className={stockCheck ? 'disable-quantity' : ''}
                    />

                    <button
                      disabled={stockCheck || isDeliveryAllowed || productData?.status === 'discontinued'}
                      className={`plus-btn ${stockCheck || isDeliveryAllowed || productData?.status === 'discontinued' ? 'disable-quantity' : ''}`}
                      onClick={increaseLocalQuantity}
                    >
                      <FaPlus size={15} className='plus-icon' />
                    </button>
                  </div>

                  <div
                    className='product-details-add-to-wishlist-icon'
                    onClick={(e) => { e.stopPropagation(); handleWishList(product); }}
                    style={{ border: isInWishList(product._id) ? '1px solid red' : '1px solid var(--orange-outline)' }}
                  >
                    {isInWishList(product?._id)
                      ? <VscHeartFilled size={25} style={{ color: 'var(--orange-fill)' }} />
                      : <VscHeart size={25} style={{ color: 'var(--orange-outline)' }} />
                    }
                  </div>

                  <button
                    className={`add-to-cart-btn ${stockCheck || isDeliveryAllowed || productData?.status === 'discontinued' ? 'disable-add-to-cart' : ''} ${isLoading ? 'loading' : ''}`}
                    disabled={stockCheck || isDeliveryAllowed || productData?.status === 'discontinued'}
                    onClick={() => addToCart0(product, activeVariation, !isProtected ? 1 : 0, quantity)}
                  >
                    {isCartLoading && <div className="loader_2"></div>}
                    {isCartLoading ? ' Almost there...' : 'Add To Cart'}
                  </button>
                </div>

                {stockCheck && (
                  <p className='out-of-stoc-message'>This product will be available in 5 to 6 weeks</p>
                )}
              </div>

              <div className='get-in-timeline-offer'>
                <BsTruck size={21} color='var(--secondary-color)' />
                <div className='get-offer-details'>
                  <h3>Get it by <span style={{ fontWeight: "600", color: "var(--tertiary-color)" }}>{getDeliveryDate()}</span></h3>
                  <p>Fully assembled & placed in your room, or in-store pickup.</p>
                  <span className='location' onClick={handleOpenLocationModal}>
                    <FaLocationDot size={17} color='var(--tertiary-color)' />
                    <p>{info.locationData.zipCode} {info.locationData.stateCode}</p>
                  </span>
                </div>
              </div>

              <div className='product-details-protection-plan-container'>
                <h3>Protect Your Investment</h3>
                <div className='product-details-protection-plan-details-and-add'>
                  <div className='product-details-protection-plan'>
                    <SiAdguard size={21} color='var(--secondary-color)' />
                    <div className='product-details-info'>
                      <p>5-Year Platinum Protection</p>
                      <span>
                        <p>+${eachProtectionValue}</p>
                        <i onClick={handleWhatIsCoveredModal}>What's Covered</i>
                      </span>
                    </div>
                  </div>

                  {protectionCheck ? (
                    <button
                      onClick={() => handleProtection('single-protection', false)}
                      className='product-detail-add-protection-plan-button'
                    >
                      Applied
                    </button>
                  ) : (
                    <button
                      disabled={isDeliveryAllowed}
                      onClick={() => handleProtection('single-protection', true)}
                      className='product-detail-add-protection-plan-button'
                    >
                      Add
                    </button>
                  )}
                </div>

                <div className='product-detail-chat-option-container'>
                  <p>Product Question?</p>
                  <button onClick={handleWhatsAppClick}>Send Us Your Query</button>
                </div>
                <p className='have-a-question-message'>
                  Have a question about this product? Our team is here to help you with details,
                  dimensions, delivery, or anything else you need to know before you buy.
                </p>
              </div>

              <div className='see-in-person-container'>
                <div className='see-it-in-person-head'>
                  <svg width="20" height="20" viewBox="0 0 64 49" fill="none" xmlns="http://www.w3.org/2000/svg" className='near-store-svg'>
                    <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--tertiary-color)" />
                  </svg>
                  <h3>See it in Person</h3>
                </div>
                <div className='see-it-in-person-body'>
                  <p>This collection is on display in 9 Stores</p>
                </div>
                <div className='see-it-in-person-book-appointment-container'>
                  <SlCalender size={20} color='var(--tertiary-color)' />
                  <p onClick={handleShowAppointmentModal}>MAKE AN APPOINTMENT</p>
                </div>
              </div>

              <div className='talk-with-expert-main-container'>
                <p>Talk with an Expert</p>
                <div className='talk-with-expert-options'>
                  <a href='tel:2153521600'>
                    <IoCallOutline size={18} color='var(--secondary-color)' />
                    Call
                  </a>
                  <button onClick={handleOpenChatUsOnly}>
                    <IoChatbubbleOutline size={18} color='var(--secondary-color)' />
                    Chat
                  </button>
                  <button onClick={handleShowAppointmentModal}>
                    <PiStorefrontLight size={18} color='var(--secondary-color)' />
                    Visit
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <ProductDisplayShimmer />
      )}

      {/* ── Sticky bottom add-to-cart bar ── */}
      <div
        className={`add-to-cart-sticky-section ${addCartSticky ? 'show-sticky-add-to-cart' : ''}`}
        style={{ boxShadow: !isSticky ? 'rgba(0, 0, 0, 0.24) 0px 3px 8px' : 'none' }}
      >
        <div className='mobile-product-sticky-fixed-add-to-cart'>
          <div className='mobile-sticky-product-sale-and-price'>
            <h3 className='sticky-section-product-name'>
              {productData?.name ? truncateTitle(productData?.name, 23) : ''}
            </h3>
            <span>
              <h3>Sale</h3>
              {/* Guard: only show price when it's actually a number */}
              <p>
                {product?.type === 'simple'
                  ? formatedPrice(productData?.sale_price || productData?.regular_price)
                  : activeVariation
                    ? formatedPrice(activeVariation?.sale_price || activeVariation?.regular_price)
                    : ''
                }
              </p>
            </span>
          </div>
          <button
            className={stockCheck ? 'disable-sticky-add-to-cart' : ''}
            disabled={stockCheck}
            onClick={() => addToCart0(productData, activeVariation, !isProtectionCheck ? 1 : 0, quantity)}
          >
            Add To Cart
          </button>
        </div>
      </div>

      <WhatIsCovered
        showCoveredModal={whatIsCoveredModa}
        handleCloseCoveredModal={handleCloseWhatIsCoveredModal}
      />

      <SnakBar
        message={snakeBarMessage}
        openSnakeBarProp={showSnakeBar}
        setOpenSnakeBar={setShowSnakeBar}
        onClick={handleCloseSnakeBar}
      />

      <ShareProduct
        isSharePopup={isSharePopup}
        setIsSharePopup={setIsSharePopup}
        selectedProduct={selectedProduct}
      />

      <AppointmentModal
        showAppointMentModal={appointmentModal}
        setAppointmentModal={setAppointmentModal}
        handleCloseModal={handleCloseAppointmentModal}
        setErrorMessage={setErrorMessage}
        snakebarOpen={showSnakeBar}
        setSnakebarOpen={setShowSnakeBar}
        handleOpenSnakeBar={handleShowSnakeToust}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        serviceIndex={serviceIndex}
        setServiceTypeIndex={setServiceTypeIndex}
      />

      <LocationPopUp
        searchLocation={showLocation}
        handleCloseSearch={handleCloseLocationModal}
        locationDetails={locationData}
        setLocationDetails={setLocationData}
      />

    </div>
  );
};

export default ProductDetailSticky;