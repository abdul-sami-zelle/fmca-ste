// 'use client'

// import React, { useEffect, useState } from 'react';
// import './Slider.css';

// import { url } from '../../utils/api';
// import Link from 'next/link';
// import Image from 'next/image';
// import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';

// const Sliderr = ({ images, height, autoSlideSpeed = 5000 }) => {

//     const [currentIndex, setCurrentIndex] = useState(0);
//     // const [isHovered, setIsHovered] = useState(false);
//     const [isDragging, setIsDragging] = useState(false);
//     const [imagePreloader, setImagePreloader] = useState(false);

//     const nextSlide = () => {
//         setCurrentIndex(prevIndex => (images?.length ? (prevIndex + 1) % images?.length : 0));
//     };

//     const handleMouseDown = (e) => {
//         setIsDragging(false); // Reset drag state on mouse down
//     };

//     const handleMouseMove = (e) => {
//         if (e.buttons === 1) {
//             setIsDragging(true); // Mark as dragging when moving with the left mouse button
//         }
//     };

//     const handleClick = (e) => {
//         if (isDragging) {
//             e.preventDefault(); // Prevent navigation if it was a drag
//         }
//     };

//     useEffect(() => {
//         const interval = setInterval(nextSlide, autoSlideSpeed);
//         return () => clearInterval(interval);
//     }, [images, autoSlideSpeed]);
    

//     return (
//         <div data-role="slider">
//             <div className="slider" style={{ cursor: 'grab', height: height || "calc(100vw * 0.26355)" }}>

//                 <SwiperSlider
//                     slidesData={images && images?.desktop}
//                     renderSlide={(img, index) => (
//                         <Link
//                             href={`${img.link_url}`}
//                             className="slide"
//                             key={index}
//                             onMouseDown={handleMouseDown}
//                             onMouseMove={handleMouseMove}
//                             onClick={handleClick}  // prevent click if dragging
//                         >
//                             <Image
//                                 src={`${url}${img.image_url}`}
//                                 alt={`slide ${index + 1}`}
//                                 width={1599}
//                                 height={360}
//                                 onDragStart={(e) => e.preventDefault()}  // Prevent drag
//                                 onLoad={() => setImagePreloader(true)}
//                                 priority={index === 0}
//                                 placeholder="blur"
//                                 blurDataURL="/blur.jpg" // or generate a small blur
//                                 // sizes="(max-width: 768px) 100vw, 50vw"
//                                 sizes="(max-width: 768px) 100vw, 100vw"
//                             />
//                         </Link>
//                     )}
//                     showDots={false}
//                     showArrows={true}
//                     spaceBetween={20}
//                     delayTime={5000}
//                     progressBarShow={false}
//                     autoplay={true}
//                     slidesPerView={1}
//                     arrowSlide={true}
//                     loop={true}
//                     isPadding={false}
//                 />

//             </div>

//             {/* Mobile View */}
//             <div className="mobile-view-slider">



//                 {images?.mobile?.length > 0 ? (
//                     <SwiperSlider
//                         slidesData={images && images?.mobile}
//                         renderSlide={(img, index) => (
//                             <Link
//                                 href={`/${img.link_url}`}
//                                 className="mobile-slide"
//                                 key={index}
//                                 onMouseDown={handleMouseDown}
//                                 onMouseMove={handleMouseMove}
//                                 onClick={handleClick}  // prevent click if dragging
//                             >
//                                 <Image
//                                     src={`${url}${img.image_url}`}
//                                     alt={`slide ${index + 1}`}
//                                     width={320}
//                                     height={320}
//                                     onDragStart={(e) => e.preventDefault()}  // Prevent drag
//                                 />
//                             </Link>
//                         )}
//                         showDots={false}
//                         showArrows={false}
//                         spaceBetween={20}
//                         autoplay={true}
//                         loop={true}
//                         delayTime={5000}
//                         slidesPerView={1}
//                     />
//                 ) : (
//                     <div className='mobile-view-slider-shimmer'></div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Sliderr;


'use client'

import React, { useEffect, useState } from 'react';
import './Slider.css';

import { url } from '../../utils/api';
import Link from 'next/link';
import Image from 'next/image';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';

const Sliderr = ({ images, height, autoSlideSpeed = 4000 }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreloader, setImagePreloader] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null); // ✅ capture swiper

    const nextSlide = () => {
        setCurrentIndex(prevIndex => (images?.length ? (prevIndex + 1) % images?.length : 0));
    };

    const handleMouseDown = () => setIsDragging(false);
    const handleMouseMove = (e) => { if (e.buttons === 1) setIsDragging(true); };
    const handleClick = (e) => { if (isDragging) e.preventDefault(); };

    // ✅ Pause autoplay on hover, resume on leave
    const handleMouseEnter = () => swiperInstance?.autoplay?.stop();
    const handleMouseLeave = () => swiperInstance?.autoplay?.start();

    useEffect(() => {
        const interval = setInterval(nextSlide, autoSlideSpeed);
        return () => clearInterval(interval);
    }, [images, autoSlideSpeed]);

    return (
        <div data-role="slider">

            {/* Desktop View */}
            <div
                className="slider"
                style={{ cursor: 'grab', height: height || "calc(100vw * 0.26355)" }}
                onMouseEnter={handleMouseEnter}  // ✅ pause on hover
                onMouseLeave={handleMouseLeave}  // ✅ resume on leave
            >
                <SwiperSlider
                    slidesData={images && images?.desktop}
                    renderSlide={(img, index) => (
                        <Link
                            href={`${img.link_url}`}
                            className="slide"
                            key={index}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onClick={handleClick}
                        >
                            <Image
                                src={`${url}${img.image_url}`}
                                alt={`slide ${index + 1}`}
                                width={1599}
                                height={360}
                                onDragStart={(e) => e.preventDefault()}
                                onLoad={() => setImagePreloader(true)}
                                priority={index === 0}
                                placeholder="blur"
                                blurDataURL="/blur.jpg"
                                sizes="(max-width: 768px) 100vw, 100vw"
                            />
                        </Link>
                    )}
                    showDots={false}
                    showArrows={true}
                    spaceBetween={20}
                    delayTime={5000}
                    progressBarShow={false}
                    autoplay={true}
                    slidesPerView={1}
                    arrowSlide={true}
                    loop={true}
                    isPadding={false}
                    onSwiper={(swiper) => setSwiperInstance(swiper)} // ✅ capture instance
                />
            </div>

            {/* Mobile View */}
            <div className="mobile-view-slider">
                {images?.mobile?.length > 0 ? (
                    <SwiperSlider
                        slidesData={images && images?.mobile}
                        renderSlide={(img, index) => (
                            <Link
                                href={`${img.link_url}`}
                                className="mobile-slide"
                                key={index}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onClick={handleClick}
                            >
                                <Image
                                    src={`${url}${img.image_url}`}
                                    alt={`slide ${index + 1}`}
                                    width={320}
                                    height={320}
                                    onDragStart={(e) => e.preventDefault()}
                                />
                            </Link>
                        )}
                        showDots={false}
                        showArrows={false}
                        spaceBetween={20}
                        autoplay={true}
                        loop={true}
                        delayTime={5000}
                        slidesPerView={1}
                    />
                ) : (
                    <div className='mobile-view-slider-shimmer'></div>
                )}
            </div>

        </div>
    );
};

export default Sliderr;