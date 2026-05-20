

import React, { useRef, useState, useEffect } from 'react';
import './ArrowSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { usePathname } from 'next/navigation';

const ArrowSlider = ({
    slidesData = [],
    renderSlide,
    showDots = false,
    showArrows = false,
    slidesPerView,
    breakpoints = null,
    spaceBetween = 20,
    onSwiper = () => { },
    externalActiveIndex,
    onSlideChangeIndex,
    autoplay = false,
    arrowLeftPosition = false,
    loop = false,
    eachSlide = false,
    delayTime = 0,
    arrowSlide = false,
    isPadding = false,
}) => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [resolvedSlidesPerView, setResolvedSlidesPerView] = useState(1);

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 480);
            setResolvedSlidesPerView(getSlidesPerView());
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSlidesPerView = () => {
        if (typeof slidesPerView === 'number') return slidesPerView;
        if (typeof breakpoints === 'object') {
            const screenWidth = window.innerWidth;
            const sortedBreakpoints = Object.entries(breakpoints)
                .map(([bp, val]) => [parseInt(bp), val.slidesPerView])
                .sort((a, b) => a[0] - b[0]);

            let matched = 1;
            for (let [bp, val] of sortedBreakpoints) {
                if (screenWidth >= bp) matched = val;
            }
            return matched;
        }
        return 1;
    };

    const handlePrev = () => {
        swiperRef.current?.slidePrev();
    };

    const handleNext = () => {
        swiperRef.current?.slideNext();
    };

    const getResolvedSlidesPerView = (swiper) => {
        if (typeof swiper.params.slidesPerView === "number") {
            return swiper.params.slidesPerView;
        } else {
            // If slidesPerView is responsive, find the closest breakpoint
            const width = window.innerWidth;
            const breakpoints = swiper.params.breakpoints;
            const sortedBreakpoints = Object.keys(breakpoints).sort((a, b) => b - a);

            for (let bp of sortedBreakpoints) {
                if (width >= bp) {
                    return breakpoints[bp].slidesPerView || 1;
                }
            }

            return 1; // fallback
        }
    };


    return (
        <div className={`arrow-slider-container ${eachSlide ? 'apply-side-padding' : ''}`}>
            {!isMobile && showArrows && slidesData.length > 4 && !isAtStart && (
                <button className={`slider-arrow slider-left ${arrowLeftPosition ? 'arrow-stick-to-start' : ''} ${eachSlide ? 'left-arrow-in-start' : ''}`} onClick={handlePrev}>
                    <IoIosArrowBack color='var(--orange-outline)' size={20} />
                </button>
            )}

            <Swiper
                className={isPadding ? 'swiper-padding' : arrowLeftPosition ? 'deal-day-position' : 'swiper'}
                loop={loop}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    onSwiper(swiper);

                    // Initial check
                    const totalSlides = slidesData.length;
                    const visibleSlides = getResolvedSlidesPerView(swiper);

                    setIsAtStart(swiper.isBeginning);
                    setIsAtEnd(swiper.activeIndex >= totalSlides - visibleSlides);
                }}
                onSlideChange={(swiper) => {
                    const newIndex = swiper.activeIndex;
                    setActiveIndex(newIndex);

                    if (onSlideChangeIndex) {
                        onSlideChangeIndex(newIndex);
                    }

                    const totalSlides = slidesData.length;
                    const visibleSlides = getResolvedSlidesPerView(swiper);

                    setIsAtStart(swiper.isBeginning);
                    setIsAtEnd(newIndex >= totalSlides - visibleSlides);
                }}
                autoplay={
                    autoplay
                        ? {
                            delay: delayTime, // ✅ 5 seconds delay
                            disableOnInteraction: false,
                        }
                        : false
                }
                modules={autoplay ? [Autoplay] : []}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                speed={600}
                breakpoints={breakpoints}
            >
                {slidesData.map((item, index) => (
                    <SwiperSlide key={index} className={eachSlide ? 'each-slide' : ''}>
                        {renderSlide(item, index)}
                    </SwiperSlide>
                ))}
            </Swiper>

            {!isMobile && showArrows && slidesData.length > 4 && !isAtEnd && (
                <button className={`slider-arrow slider-right ${arrowLeftPosition ? 'arrow-right-to-start' : ''} ${eachSlide ? 'right-arrow-in-start' : ''}`} onClick={handleNext}>
                    <IoIosArrowForward size={20} color='var(--orange-outline)' />
                </button>
            )}

            {showDots && isMobile && (
                <div className="custom-pagination-dots">
                    {(() => {
                        const currentIndex = externalActiveIndex ?? activeIndex;

                        // ✅ FIXED: Use steps instead of page count
                        const totalSteps = Math.max(slidesData.length - resolvedSlidesPerView + 1, 1);

                        const visibleDotCount = 5;
                        const half = Math.floor(visibleDotCount / 2);

                        let start = currentIndex - half;
                        let end = currentIndex + half + 1;

                        if (start < 0) {
                            start = 0;
                            end = visibleDotCount;
                        }

                        if (end > totalSteps) {
                            end = totalSteps;
                            start = Math.max(0, totalSteps - visibleDotCount);
                        }

                        return Array.from({ length: end - start }).map((_, i) => {
                            const dotIndex = start + i;
                            const isActive = dotIndex === currentIndex;

                            return (
                                <span
                                    key={dotIndex}
                                    className={`dot ${isActive ? 'active' : ''}`}
                                    onClick={() => swiperRef.current?.slideTo(dotIndex)}
                                />
                            );
                        });
                    })()}
                </div>
            )}

        </div>
    );
};

export default ArrowSlider