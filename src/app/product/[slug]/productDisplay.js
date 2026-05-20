'use client'

import React, { use, useEffect, useRef, useState } from 'react'
import './ProductDisplay.css';
import ProductDetailSticky from '@/UI/Components/Product-Display-Components/ProductDetailSticky/ProductDetailSticky';
import ProductStickyTabBar from '@/UI/Components/Product-Display-Components/ProductStickyTabBar/ProductStickyTabBar';
import ProductDescriptionTab from '@/UI/Components/Product-Display-Components/ProductTabs/ProductDescriptionTab/ProductDescriptionTab';
import ProductDetailTab from '@/UI/Components/Product-Display-Components/ProductTabs/ProductDetailTab/ProductDetailTab';
import ProductRecommendationTab from '@/UI/Components/Product-Display-Components/ProductTabs/ProductRecommendationTab/ProductRecommendationTab';
import ProductReviewTab from '@/UI/Components/Product-Display-Components/ProductTabs/ProductReviewTab/ProductReviewTab';

import { url, useDisableBodyScroll } from '../../../utils/api';
import { useCart } from '@/context/cartContext/cartContext';
import GalleryModal from '@/UI/Components/Product-Display-Components/GalleryModal/GalleryModal';
import { useProductPage } from '@/context/ProductPageContext/productPageContext';
import DesignYourRoom from '@/UI/Components/DesignYourRoom/DesignYourRoom';
import useSWR from 'swr';
import { fetcher } from '@/utils/Fetcher';
import DesignYourRoomIndv from '@/UI/Components/DesignRoomInd/DesignYourRoomIndv';
import DesignRoomMain from '@/UI/Modals/DesignYourRoomModal/DesignYourRoom';
import { useIsMobile } from '@/utils/isMobile';
import SideCart from '@/UI/Components/Cart-side-section/SideCart';
import axios from 'axios';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import DisableDelivery from '@/Global-Components/DisableDelivery/DisableDelivery';

const ProductDisplay = ({ params }) => {

  const { slug } = use(params);
  const { singleProductData, selectedVariationData } = useProductPage();
  const [product, setProduct] = useState(singleProductData || null);
  const [showDesignRoomModal, setShowDwsignRoomModal] = useState(false);
  const [productDetails, setProductDetails] = useState({})
  const [isSticky, setIsSticky] = useState(false)
  const [singleProductCount, setSingleProductCount] = useState(0);
  const [variationData, setVariationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProtectionCheck, setIsProtectionCheck] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [zoomIn, setZoomIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0); // For main slider image
  const [thumbActiveIndex, setThumbActiveIndex] = useState(0); // For active thumbnail
  const thumbnailContainerRef = useRef(null); // To control the vertical scroll
  const [dimensionModal, setDimensionModal] = useState(false)
  const [clickedType, setClickedType] = useState('')
  const [galleryModalWidth, setGalleryModalWidth] = useState(false);
  const [steperIndex, setSteperIndex] = useState(0);

  const isMobile = useIsMobile()


  const tabBarItems = [
    // ...(productData?.dyrc?.active === 1  ? ['DesignYourRoom'] : []),
    ...(product?.type === 'variable'
      ? selectedVariationData?.dyrc?.active === 1
        ? ['DesignYourRoom']
        : []
      : product?.dyrc?.active === 1
        ? ['DesignYourRoom']
        : []),
    'Description',
    'Details'
  ];

  const filteredTabItems = isMobile
    ? tabBarItems.filter(item => item !== 'DesignYourRoom')
    : tabBarItems;


  const showDRM = () => {
    setShowDwsignRoomModal(true)
  }

  const closeDRM = () => {
    setShowDwsignRoomModal(false)
  }

  useEffect(() => {
    setProductDetails({
      collection: product?.collectionName ? product?.collectionName : '-',
      color: product?.default_attributes?.find(item => item.type === 'color')?.options[0]?.name,
      brand: product?.brand !== '' ? product?.brand : 'Furniture Mecca',
      category: product?.categories?.find(item => item.is_main === 1)?.name,
      stock: product?.manage_stock?.stock_status?.toLowerCase() === 'instock' ? 'In Stock' : product?.manage_stock?.stock_status?.toLowerCase() === 'backorder' ? 'Back Order' : 'Back Order',
      mpn: product?.mpn,
      gtin: product?.gtin,
      protection: 'Available'
    })
  }, [product])

  const singleProductApi = slug ? `${url}/api/v1/products/get-by-slug/${slug}` : null;
  const { data: singleProductContent, error: singleProductError, isLoading: singleProductLoading } = useSWR(singleProductApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 24 * 365
  })

  if (singleProductError && singleProductCount < 3) {
    setTimeout(() => {
      setSingleProductCount(singleProductCount + 1);
    }, 1000)
  }

  useEffect(() => {
    if (singleProductContent) {
      setProduct(singleProductContent.products[0])
    }
  }, [singleProductContent])

  // const handleProductData = async () => {
  //   const api = `${url}/api/v1/products/get-by-slug/${slug}`;
  //   try {
  //     const response = await axios.get(api);
  //     setProduct(response.data.products[0])
  //   } catch (error) {
  //     console.error("UnExpected  Server Error", error);
  //   }
  // }


  // useEffect(() => {handleProductData()}, [])

  const sectionRefs = {
    DesignYourRoom: useRef(null),
    Description: useRef(null),
    Details: useRef(null),
    Recommendations: useRef(null),
    Reviews: useRef(null),
  };

  // Add To Cart Functionality
  const {
    decreamentQuantity,
    increamentQuantity,
    removeFromCart,
    addToCart0,
    cartProducts,
    cartSection,
    setCartSection,
    isCartLoading,
  } = useCart();


  const decreaseLocalQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  }

  const increaseLocalQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  }

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value)
  }

  const handleClick = () => {

  };

  const handleAddToCartProduct = (product) => {

    // setCartSection(true);
  }

  const handleCartClose = () => {
    setCartSection(false)
    setQuantity(1)
  }


  const handleOpenModal = (place, type) => {
    setZoomIn(false);
    setClickedType(type === 'dimenssion-show' ? type : 'dimenssion-hide')
    if (place === 'image-clicked') {
      setGalleryModalWidth(true)
    } else {
      setGalleryModalWidth(false)
    }
    setDimensionModal(true)
  }

  const handleCloseDimensionModal = () => {
    setDimensionModal(false)
    setActiveIndex(0)
    setThumbActiveIndex(0)
    setCurrentIndex(0)
  }

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    setThumbActiveIndex(index);
    setCurrentIndex(index)

    // Prevent page scroll
    if (thumbnailContainerRef.current) {
      const thumbnailElement = thumbnailContainerRef.current.children[index];
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          thumbnailContainerRef.current.scrollTo({
            left: thumbnailElement.offsetLeft - (thumbnailContainerRef.current.clientWidth / 2) + (thumbnailElement.clientWidth / 2),
            behavior: 'smooth',
          });
        } else {
          thumbnailContainerRef.current.scrollTo({
            top: thumbnailElement.offsetTop - (thumbnailContainerRef.current.clientHeight / 2) + (thumbnailElement.clientHeight / 2),
            behavior: 'smooth',
          });
        }
      }
    }
  };

  const handlePrevImage = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === 0) return prevIndex; // Prevent moving before first item

      const newIndex = prevIndex - 1;
      setThumbActiveIndex(newIndex); // Update active thumbnail index

      setCurrentIndex(newIndex)

      // Scroll thumbnail container
      if (thumbnailContainerRef.current) {
        if (typeof window !== 'undefined') {
          if (window.innerWidth < 480) {
            // Scroll left for mobile screens
            thumbnailContainerRef.current.scrollBy({
              left: -80, // Adjust scroll step based on your layout
              behavior: 'smooth',
            });
          } else {
            // Scroll up for larger screens
            thumbnailContainerRef.current.scrollBy({
              top: -80,
              behavior: 'smooth',
            });
          }
        }
      }

      return newIndex;
    });
  };

  const handleNextImage = () => {
    setActiveIndex((prevIndex) => {
      const length =
        product.type === 'variable'
          ? selectedVariationData?.images?.length + 1
          : product?.images?.length;

      if (prevIndex === length) return prevIndex; // Prevent moving after last item

      const newIndex = prevIndex + 1;
      setThumbActiveIndex(newIndex); // Update active thumbnail index
      setCurrentIndex(newIndex)
      // setZoomIn(false);

      // Scroll thumbnail container
      if (thumbnailContainerRef.current) {
        if (typeof window !== 'undefined') {
          if (window.innerWidth < 480) {
            // Scroll right for mobile screens
            thumbnailContainerRef.current.scrollBy({
              left: 80, // Adjust scroll step based on your layout
              behavior: 'smooth',
            });
          } else {
            // Scroll down for larger screens
            thumbnailContainerRef.current.scrollBy({
              top: 80,
              behavior: 'smooth',
            });
          }
        }
      }

      return newIndex;
    });
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setActiveIndex(index); // Ensure the main slider image updates
    setThumbActiveIndex(index); // Ensure the thumbnail updates
  };

  useEffect(() => {
    if (dimensionModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [dimensionModal])


  useEffect(() => {
    if (showDesignRoomModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [showDesignRoomModal])

  useEffect(() => {
    if (dimensionModal) {
      handleThumbnailClick(activeIndex); // sync thumbnail to current slide index
    }
  }, [dimensionModal]);

  const stockCheck = product?.type === 'variable' ?
    selectedVariationData?.manage_stock?.stock_status === 'inStock'
    && selectedVariationData?.manage_stock?.quantity === 0
    || selectedVariationData?.manage_stock?.stock_status === 'outStock'
    || selectedVariationData?.manage_stock?.stock_status === 'outOfStock'
    : product?.manage_stock?.stock_status === 'inStock'
    && product?.manage_stock?.quantity === 0
    || product?.manage_stock?.stock_status === 'outStock'
    || product?.manage_stock?.stock_status === 'outOfStock';

  const isVariableOrNot = product.type === 'variable' ? true : false
  const isDesignRoomActive =
    product?.type === 'variable' ? (
      selectedVariationData?.dyrc?.active === 1 ? true : false) :
      product?.dyrc?.active === 1 ? true : false;


  const { showDeliveryMessage } = useGlobalContext();
  const produtPageRef = useRef()


  return (
    <div ref={produtPageRef}>
      <div className='product-display-page-main-container'>
        <ProductDetailSticky
          productData={product}
          decreaseLocalQuantity={decreaseLocalQuantity}
          quantity={quantity}
          handleQuantityChange={handleQuantityChange}
          increaseLocalQuantity={increaseLocalQuantity}
          isLoading={isLoading}
          stockCheck={stockCheck}
          isProtectionCheck={isProtectionCheck}
          cartSection={cartSection}
          variationData={variationData}
          setVariationData={setVariationData}
          isSticky={isSticky}
          handleGalleryModal={handleOpenModal}
          isCartLoading={isCartLoading}
          params={params}
          showDesignRoomModal={showDesignRoomModal}
          showDRM={showDRM}
          dimensionModal={dimensionModal}
          setClickedType={setClickedType}
          setProductDetails={setProductDetails}
          zoomIn={zoomIn}
          setZoomIn={setZoomIn}
        />

        <ProductStickyTabBar
          sectionRefs={sectionRefs}
          selectedVariationData={selectedVariationData}
          productData={product}
          isSticky={isSticky}
          setIsSticky={setIsSticky}
          variationData={variationData}
          addToCart0={addToCart0}
          handleAddToCartProduct={handleAddToCartProduct}
          isProtectionCheck={isProtectionCheck}
          quantity={quantity}
          steperIndex={steperIndex}
          setSteperIndex={setSteperIndex}
          tabBarItems={tabBarItems}
          filteredTabItems={filteredTabItems}
          stockCheck={stockCheck}
        />

        <div className='sticky-section-steper-main-container'>


          {(() => {
            // Handle first index
            if (steperIndex === 0) {
              if (isMobile) {
                return (
                  <div className="steper-description-tranition show-description-transition">
                    <ProductDescriptionTab
                      descriptionRef={sectionRefs.Description}
                      productData={product}
                      addMarginTop={isSticky}
                    />
                  </div>
                );
              } else if (isDesignRoomActive) {
                return (
                  <div className="design-room-transition">
                    <DesignYourRoomIndv
                      designRef={sectionRefs.DesignYourRoom}
                      openFN={showDRM}
                      productUid={product?.uid}
                      image={
                        isVariableOrNot
                          ? selectedVariationData.images.length > 1
                            ? selectedVariationData?.images[1]?.image_url
                            : selectedVariationData.image.image_url
                          : product.images.length > 1
                            ? product.images[1].image_url
                            : product.image.image_url
                      }
                    />
                  </div>
                );
              } else {
                // If DesignRoom is NOT active, index 0 is Description
                return (
                  <div className="steper-description-tranition show-description-transition">
                    <ProductDescriptionTab
                      descriptionRef={sectionRefs.Description}
                      productData={product}
                      addMarginTop={isSticky}
                    />
                  </div>
                );
              }
            }

            // Handle second index
            if (steperIndex === 1) {
              if (isDesignRoomActive) {
                // In 3-step flow → index 1 = Description
                return (
                  <div className="steper-description-tranition show-description-transition">
                    <ProductDescriptionTab
                      descriptionRef={sectionRefs.Description}
                      productData={product}
                      addMarginTop={isSticky}
                    />
                  </div>
                );
              } else {
                // In 2-step flow → index 1 = Details
                return (
                  <div className="steper-details-tranition show-details-transition">
                    <ProductDetailTab
                      detailsRef={sectionRefs.Details}
                      productData={product}
                      productDetails={productDetails}
                    />
                  </div>
                );
              }
            }

            // Handle third index (only valid if DesignRoom is active)
            if (steperIndex === 2 && isDesignRoomActive) {
              return (
                <div className="steper-details-tranition show-details-transition">
                  <ProductDetailTab
                    detailsRef={sectionRefs.Details}
                    productData={product}
                    productDetails={productDetails}
                  />
                </div>
              );
            }

            return null;
          })()}




          {/* {(isMobile && steperIndex === 0) || (!isMobile && isDesignRoomActive && steperIndex === 0) ? (
            // Design Room or Description (index 0 logic)
            isMobile ? (
              <div className="steper-description-tranition show-description-transition">
                <ProductDescriptionTab
                  descriptionRef={sectionRefs.Description}
                  productData={product}
                  addMarginTop={isSticky}
                />
              </div>
            ) : (
              <div className="design-room-transition">
                <DesignYourRoomIndv
                  designRef={sectionRefs.DesignYourRoom}
                  openFN={showDRM}
                  productUid={product?.uid}
                  image={
                    isVariableOrNot
                      ? selectedVariationData.images.length > 1
                        ? selectedVariationData?.images[1]?.image_url
                        : selectedVariationData.image.image_url
                      : product.images.length > 1
                        ? product.images[1].image_url
                        : product.image.image_url
                  }
                />
              </div>
            )
          ) : (
            // Now handle Description (if it's index 1) or Details (index 2)
            (steperIndex === 1 && (!isMobile || (isMobile && filteredTabItems[1] === 'Description'))) ? (
              <div className="steper-description-tranition show-description-transition">
                <ProductDescriptionTab
                  descriptionRef={sectionRefs.Description}
                  productData={product}
                  addMarginTop={isSticky}
                />
              </div>
            ) : (
              <div className="steper-details-tranition show-details-transition">
                <ProductDetailTab
                  detailsRef={sectionRefs.Details}
                  productData={product}
                  productDetails={productDetails}
                />
              </div>
            )
          )} */}


          {/* {isDesignRoomActive && steperIndex === 0 ? (
            // Design Your Room at index 0
            <div className="design-room-transition">
              <DesignYourRoomIndv
                designRef={sectionRefs.DesignYourRoom}
                openFN={showDRM}
                productUid={product?.uid}
                image={
                  isVariableOrNot ? selectedVariationData.images.length > 1 ? selectedVariationData?.images[1]?.image_url : selectedVariationData.image.image_url : product.images.length > 1 ? product.images[1].image_url : product.image.image_url
                }

              // image={product.images[1].image_url}
              />
            </div>
          ) : (!isDesignRoomActive && steperIndex === 0) ||  (isDesignRoomActive && steperIndex === 1) || (isMobile && steperIndex === 1)  ? (
            // Description becomes index 0 if DesignRoom is inactive, otherwise index 1


            <div className="steper-description-tranition show-description-transition">
              <ProductDescriptionTab
                descriptionRef={sectionRefs.Description}
                productData={product}
                addMarginTop={isSticky}
              />
            </div>
          ) : (
            // Details becomes index 1 if DesignRoom is inactive, otherwise index 2
            <div className="steper-details-tranition show-details-transition">
              <ProductDetailTab
                detailsRef={sectionRefs.Details}
                productData={product}
                productDetails={productDetails}
              />
            </div>
          )} */}



          {/* {steperIndex === 0 ? (
            <div className={`design-room-transition ${steperIndex === 0 ? 'show-design-room-view' : ''}`}>
              {product && <DesignYourRoomIndv designRef={sectionRefs.DesignYourRoom} openFN={showDRM} image={product?.images?.length > 1 ? product?.images[1]?.image_url : product?.image?.image_url} />}
            </div>
          ) : steperIndex === 1 ? (
            <div className={`steper-description-tranition ${steperIndex === 1 ? 'show-description-transition' : ''}`}>
              <ProductDescriptionTab
                descriptionRef={sectionRefs.Description}
                productData={product}
                addMarginTop={isSticky}
              />
            </div>
          ) : (
            <div className={`steper-details-tranition ${steperIndex === 2 ? 'show-details-transition' : ''}`}>
              <ProductDetailTab
                detailsRef={sectionRefs.Details}
                productData={product}
                productDetails={productDetails}
              />
            </div>
          )} */}
        </div>

        <ProductRecommendationTab
          recommendationRef={sectionRefs.Recommendations}
          product={product}
        />

      </div>

      <ProductReviewTab
        reviewRef={sectionRefs.Reviews}
        productData={product}
        params={params}
      />

      {showDesignRoomModal && <div className='design_room_main_modal'>
        {/* <DesignRoomMain closeFn={closeDRM} product={product} /> */}
        <DesignRoomMain closeFn={closeDRM} product={product} data={
          product.type === 'variable' ?
            {
              _id: selectedVariationData?._id,
              product_uid: product?.parent === 0 ? product?.uid : product?.parent,
              variation_uid: product?.parent === 0 ? 0 : selectedVariationData?.uid,
              name: product?.name,
              sku: selectedVariationData?.sku,
              quantity: 1,
              is_protected: 0,
              slug: selectedVariationData?.slug,
              type: product?.type,
              // cat:'Sectional',
              // cat:'Recliner-Sectional',
              // cat:'Recliner',
              cat: selectedVariationData?.dyrc?.catType,
              parent: selectedVariationData?.parent,
              isVariable: product?.parent === 0 ? 0 : 1,
              attributes: selectedVariationData?.attributes,
              regular_price: selectedVariationData?.regular_price,
              sale_price: selectedVariationData?.sale_price,
              image: selectedVariationData?.image?.image_url,
              // png_image: "/furniture/Bartram-6-PC-Reclining-Sectional.png",
              // png_image:"/sectionals/Mason-2PC-Sectional.png" //sectional
              // png_image:'/Sofas&LoveSeat/Untitled-3.png' //Recliner
              // png_image:'/Sofas&LoveSeat/Untitled-4.png'
              png_image: selectedVariationData?.dyrc?.image,
            }
            : {
              _id: product?._id,
              product_uid: product?.parent === 0 ? product?.uid : product?.parent,
              variation_uid: product?.parent === 0 ? 0 : product?.uid,
              name: product?.name,
              sku: product?.sku,
              quantity: 1,
              is_protected: 0,
              slug: product?.slug,
              type: product?.type,
              // cat:'Sectional',
              // cat:'Recliner-Sectional',
              // cat:'Recliner',
              cat: product?.dyrc?.catType,
              parent: product?.parent,
              isVariable: product?.parent === 0 ? 0 : 1,
              attributes: product?.attributes,
              regular_price: product?.regular_price,
              sale_price: product?.sale_price,
              image: product?.image?.image_url,
              // png_image: "/furniture/Bartram-6-PC-Reclining-Sectional.png",
              // png_image:"/sectionals/Mason-2PC-Sectional.png" //sectional
              // png_image:'/Sofas&LoveSeat/Untitled-3.png' //Recliner
              // png_image:'/Sofas&LoveSeat/Untitled-4.png'
              png_image: product?.dyrc?.image,
            }
        } />
      </div>}

      <GalleryModal
        dimensionModal={dimensionModal}
        setDimensionModal={setDimensionModal}
        handleCloseDimensionModal={handleCloseDimensionModal}
        productData={product}
        clickedType={clickedType}
        variationData={selectedVariationData}
        handleNextImage={handleNextImage}
        handlePrevImage={handlePrevImage}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        handleThumbnailClick={handleThumbnailClick}
        thumbActiveIndex={thumbActiveIndex}
        currentIndex={currentIndex}
        handleDotClick={handleDotClick}
        galleryModalWidth={galleryModalWidth}
      />

      <SideCart
        isCartOpen={cartSection}
        handleCloseSideCart={handleCartClose}
      />


      {showDeliveryMessage && (
        <DisableDelivery parentRef={produtPageRef} />
      )}
    </div>
  )
}

export default ProductDisplay