import React, { useEffect, useRef, useState } from 'react';
import './GalleryModal.css';
import { RxCross2 } from "react-icons/rx";
import { url } from '../../../../utils/api';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import { IoIosClose } from 'react-icons/io';
import FsLightbox from 'fslightbox-react';

import Lightbox from "yet-another-react-lightbox";
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import "yet-another-react-lightbox/styles.css";


const GalleryModal = ({
  dimensionModal,
  handleCloseDimensionModal,
  productData,
  variationData,
  handleThumbnailClick,
  thumbActiveIndex,
  activeIndex,
  clickedType,
  setActiveIndex,
  galleryModalWidth,
  setDimensionModal
}) => {

  const swiperRef = useRef();


  const hasDimensionImage = productData?.dimension_image?.image_url?.trim();


  const updatedVariationImages = hasDimensionImage
    ? [
      ...(variationData?.images || []),
      {
        alt_text: "",
        description: "",
        image_url: productData?.dimension_image?.image_url,
        link_url: "",
        title: "",
      },
    ]
    : variationData?.images || [];

  const variationImagesWithoutDimenssion = [...(variationData?.images || [])]
  const simpleImagesWithoutDimenssion = [...(productData?.images || [])]

  const updatedSimpleImages = hasDimensionImage
    ? [...productData?.images, { image_url: productData?.dimension_image?.image_url }]
    : productData?.images;

  const mobileUpdatedImages = hasDimensionImage ? [
    { image_url: productData?.dimension_image?.image_url }, 
    ...productData?.images
  ] 
  : productData?.images;

  const updatedVariationImagesForMobile = hasDimensionImage
    ? [
      {
        alt_text: "",
        description: "",
        image_url: productData?.dimension_image?.image_url,
        link_url: "",
        title: "",
      },
      ...(variationData?.images || []),
      
    ]
    : variationData?.images || [];

  const withDimensionImages = productData?.type === 'variable' ? updatedVariationImages : updatedSimpleImages;
  const withoutDimensionImages = productData.type === 'variable' ? variationImagesWithoutDimenssion : simpleImagesWithoutDimenssion

  const images = clickedType === 'dimenssion-show' ? withDimensionImages : withoutDimensionImages


  const mobileWithDimenssion = productData?.type === 'variable' ? updatedVariationImagesForMobile : mobileUpdatedImages

  const mobileImages = clickedType === 'dimenssion-show' ? mobileWithDimenssion : withoutDimensionImages


  const onThumbnailClick = (index) => {
    swiperRef.current?.slideTo(index);
  };

  const lastIndex = images?.length - 1
  useEffect(() => {
    if (dimensionModal && swiperRef.current) {
      const startIndex = clickedType === 'dimenssion-show' ? lastIndex : 0;

      swiperRef.current.slideTo(startIndex);
      setActiveIndex(startIndex);
      // handleThumbnailClick(startIndex)
      setTimeout(() => {
        handleThumbnailClick(startIndex);
      }, 0);
    }
  }, [dimensionModal, clickedType])


  function setupMobileState(setIsMobile, breakpoint = 768) {
    const updateState = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };


    window.addEventListener('resize', updateState);
    updateState(); // initial check

    return () => {
      window.removeEventListener('resize', updateState);
    };
  }


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cleanup = setupMobileState(setIsMobile);
    return cleanup;
  }, []);


  useEffect(() => {
    const handlePopState = () => {
      if (dimensionModal) {
        setDimensionModal(false);
      }
    };

    if (dimensionModal) {
      // Push a new state into the history stack when modal opens
      window.history.pushState({ modalOpen: true }, '');

      // Listen for back button
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      // Cleanup the listener when modal is closed or component unmounts
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dimensionModal]);

  // useEffect(() => {
  //   if (dimensionModal && swiperRef.current) {
  //     swiperRef.current.slideTo(0);         // Reset Swiper to first slide
  //     setActiveIndex(0);                    // Reset state
  //     handleThumbnailClick(0);              // Highlight first thumbnail
  //   }
  // }, [dimensionModal]);

  function ImageZoomOnHover({ src, zoom = 3 }) {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    };

    return (
      <div
        className="dimension-modal-slider-single-image-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ overflow: "hidden", position: "relative" }}
      >
        <img
          src={src}
          alt="zoom"
          className="dimension-modal-slider-image"
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
            transform: isHovering ? `scale(${zoom})` : "scale(1)",
            transition: isHovering ? "transform 0.1s ease" : "transform 0.3s ease",
            pointerEvents: "none",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className={`dimension-modal-main-container ${dimensionModal ? 'show-dimension-modal' : ''}`}>
        <div className={`dimension-modal-inner-container ${galleryModalWidth ? 'show-modal-full-width' : ''}`}>
          {/* <button className='dimension-modal-close-button' onClick={handleCloseDimensionModal}> */}
          <IoIosClose size={25} color='var(--secondary-color)' className='dimension-modal-close-button' onClick={handleCloseDimensionModal} />
          {/* </button> */}

          {/* Thumbnail Section */}
          <div className='dimension-left-thumbnail-section'>
            <div className='dimension-modal-products-thumb-heading'>
              <p>Product Photos ({images?.length})</p>
            </div>
            <div className='thumb-images-main-container'>
              {images?.map((item, index) => (
                <div
                  key={index}
                  className={`dimension-modal-thumb-single-image ${index === thumbActiveIndex ? 'dimension-modal-active-thumb' : ''}`}
                  onClick={() => {
                    onThumbnailClick(index); // this slides Swiper
                    handleThumbnailClick(index); // this updates thumbActiveIndex
                  }}
                >
                  <img src={`${url}${item.image_url}`} alt='thumb' className='dimension-modal-thumbnail-single-image' />
                </div>
              ))}
            </div>
          </div>

          {/* Swiper Slider Section */}
          <div className='dimension-modal-slider'>
            <SwiperSlider
              slidesData={images}
              renderSlide={(img, index) => (
                <div key={index} className='dimension-modal-slider-single-image-container'>
                  {galleryModalWidth ? (
                    <ImageZoomOnHover src={`${url}${img.image_url}`} zoom={3} />
                  ) : (
                    <img
                      src={`${url}${img.image_url}`}
                      alt='slide'
                      className='dimension-modal-slider-image'
                    />
                  )}
                </div>
              )}
              showDots={true}
              showArrows={false}
              slidesPerView={1}
              spaceBetween={0}
              externalActiveIndex={activeIndex}
              onSlideChangeIndex={(index) => {
                setActiveIndex(index);
                onThumbnailClick(index);
                handleThumbnailClick(index);
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            />
          </div>
        </div>


      </div>

      {isMobile && (
        <Lightbox
          open={dimensionModal}
          close={() => setDimensionModal(false)}
          slides={mobileImages?.map((img) => ({ src: `${url}${img.image_url}` }))}
          plugins={[Zoom]}
          carousel={{ finite: false }}
        />
      )}
    </>

  );
};

export default GalleryModal;