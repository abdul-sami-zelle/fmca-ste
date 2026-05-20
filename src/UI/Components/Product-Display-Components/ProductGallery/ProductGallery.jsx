import React, { useState, useRef } from 'react';
import './ProductGallery.css';
import { IoIosArrowUp, IoIosArrowDown, IoMdArrowDropleft } from "react-icons/io";
import { url } from '../../../../utils/api';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';

const ProductGallery = ({
    productData,
    selectedVariationData,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    handleGalleryModal,
    stockCheck,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [thumbActiveIndex, setThumbActiveIndex] = useState(0);
    const thumbnailContainerRef = useRef(null);
    const swiperRef = useRef(null);

    const images = productData.type === 'variable'
        ? selectedVariationData?.images || []
        : productData?.images || [];

    // const handleThumbnailClick = (index) => {
    //     swiperRef.current?.slideTo(index);
    // };

    const handleThumbnailClick = (index) => {
        swiperRef.current?.slideTo(index);
        setActiveIndex(index); // ✅ sync state
        setThumbActiveIndex(index); // ✅ highlight thumb
    };

    const scrollThumbnailIntoView = (index) => {
        if (!thumbnailContainerRef.current) return;
        const thumbnail = thumbnailContainerRef.current.children[index];
        if (!thumbnail) return;

        const scrollOptions = {
            behavior: 'smooth',
        };

        if (window.innerWidth < 480) {
            scrollOptions.left =
                thumbnail.offsetLeft -
                thumbnailContainerRef.current.clientWidth / 2 +
                thumbnail.clientWidth / 2;
        } else {
            scrollOptions.top =
                thumbnail.offsetTop -
                thumbnailContainerRef.current.clientHeight / 2 +
                thumbnail.clientHeight / 2;
        }

        thumbnailContainerRef.current.scrollTo(scrollOptions);
    };

    const handleScroll = (direction) => {
        const length = images.length;
        const newIndex =
            direction === 'up'
                ? (thumbActiveIndex === 0 ? length - 1 : thumbActiveIndex - 1)
                : (thumbActiveIndex === length - 1 ? 0 : thumbActiveIndex + 1);

        swiperRef.current?.slideTo(newIndex);
    };


    function ImageZoomOnHover({ src, zoom = 2.5, zoomActive = false }) {
        const imageRef = useRef(null); // ✅ Replaced useState with useRef for performance (no re-renders)

        // ✅ Replaced offset tracking + translate with direct cursor-based transform-origin
        const handleMouseMove = (e) => {
            if (!zoomActive || !imageRef.current) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            // ✅ Calculate percentage position inside the image
            const percentX = (offsetX / rect.width) * 100;
            const percentY = (offsetY / rect.height) * 100;

            // ✅ Dynamically set zoom origin to follow cursor
            imageRef.current.style.transformOrigin = `${percentX}% ${percentY}%`;
        };

        const handleMouseEnter = () => {
            if (imageRef.current) {
                // ✅ Apply zoom on enter
                imageRef.current.style.transform = `scale(${zoom})`;
                imageRef.current.style.transition = "transform 0.2s ease";
            }
        };

        const handleMouseLeave = () => {
            if (imageRef.current) {
                // ✅ Reset zoom + origin when leaving
                imageRef.current.style.transform = "scale(1)";
                imageRef.current.style.transition = "transform 0.4s ease";
                imageRef.current.style.transformOrigin = "center center"; // reset origin
            }
        };

        return (
            <div
                className="dimension-modal-slider-single-image-container"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    overflow: "hidden",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                }}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt="zoom"
                    style={{
                        // ✅ Removed translate/offset logic
                        transform: "scale(1)",
                        transition: "transform 0.4s ease",
                        transformOrigin: "center center", // initial origin
                        pointerEvents: "none",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        cursor: 'pointer',
                    }}
                />
            </div>
        );
    }

    // const inStockAndQuantityZero = productData?.type === 'variable' ?  '' : productData?.manage_stock?.stock_status === 'inStock' && productData?.manage_stock?.quantity === 0 || productData?.manage_stock?.stock_status === 'outStock';

    return (
        <div className='product-gallery-main-container'>
            {/* Thumbnail Section */}
            <div className='product-gallery-thumbnail-section'>
                <IoIosArrowUp
                    size={25}
                    color='#000'
                    className={`product-thumbnail-arrow product-thumbnail-arrow-up ${thumbActiveIndex === 0 ? 'disabled' : ''}`}
                    onClick={thumbActiveIndex === 0 ? null : () => handleScroll('up')}
                />

                <div className='product-thumbnail-images' ref={thumbnailContainerRef}>
                    {images.map((thumbItem, index) => (
                        <div
                            key={index}
                            className={`product-thumbnail-single-image-div ${index === thumbActiveIndex ? 'active-thumb' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                        >
                            <IoMdArrowDropleft
                                size={30}
                                color='var(--tertiary-color)'
                                className={`arrow-pointer ${index === thumbActiveIndex ? 'show-pointer-arrow' : ''}`}
                            />
                            <img src={productData.outSource === true ? thumbItem.image_url : `${url}${thumbItem.image_url}`} alt="thumb" className="product-thumbnail-single-image" />
                        </div> 
                    ))}
                </div>

                <IoIosArrowDown
                    size={25}
                    color='#000'
                    className={`product-thumbnail-arrow product-thumbnail-arrow-down ${thumbActiveIndex === images.length - 1 ? 'disabled' : ''}`}
                    onClick={thumbActiveIndex === images.length - 1 ? null : () => handleScroll('down')}
                />

                <button onClick={() => handleGalleryModal('image-clicked', 'dimenssion-hide')} className='product-gallery-view-all-button'>
                    View All
                </button>
            </div>

            {/* Main Slider Section */}
            <div
                className='product-gallery-main-slider-section'
            >
                <div className='product-gallery-main-slider-images'>
                    { 
                        stockCheck ? <span className='produt-stock-status-label'>Back Order</span>
                        : <></>
                    }
                    <SwiperSlider
                        slidesData={images}
                        renderSlide={(imgItem, index) => (
                            <div
                                key={index}
                                className='product-gallery-main-slider-single-image-container'
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => handleGalleryModal('image-clicked', 'dimenssion-hide')}
                            >
                                {zoomIn ? (
                                    <ImageZoomOnHover src={productData.outSource === true ? imgItem.image_url : `${url}${imgItem.image_url}`} zoom={2.5} zoomActive={true} />
                                ) : (
                                    <img
                                        src={productData.outSource === true ? imgItem.image_url : `${url}${imgItem.image_url}`}
                                        alt="Main"
                                        className="product-gallery-main-slider-image"
                                        style={{ width: '100%', cursor: 'pointer' }}
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
                            setThumbActiveIndex(index);
                            scrollThumbnailIntoView(index);
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    />

                    {/* <SwiperSlider
                        slidesData={images}
                        renderSlide={(imgItem, index) => (
                            <div
                                key={index}
                                className='product-gallery-main-slider-single-image-container'
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onClick={() => handleGalleryModal('image-clicked', 'dimenssion-hide')}
                            >
                                {zoomIn ? (
                                    <ImageZoomOnHover src={`${url}${imgItem.image_url}`} zoom={2.5} zoomActive={true} />
                                ) : (
                                    <img
                                        src={`${url}${imgItem.image_url}`}
                                        alt="Main"
                                        className="product-gallery-main-slider-image"
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </div>
                        )}
                        showDots={true}
                        showArrows={false}
                        slidesPerView={1}
                        spaceBetween={0}
                        activeIndex={activeIndex}
                        setActiveIndex={(index) => {
                            setActiveIndex(index); // ✅ Main index state
                            setThumbActiveIndex(index); // ✅ Thumbnail active index
                            scrollThumbnailIntoView(index); // ✅ Scroll thumb into view
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
