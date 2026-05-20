import React, { useRef, useState, useEffect } from 'react';
import './SwiperSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

const SwiperSlider = ({
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
    loop = false,
    delayTime = 0,
    progressBarShow = false,
    height = '100%',
    arrowSlide = false,
    isPadding = false,
}) => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [resolvedSlidesPerView, setResolvedSlidesPerView] = useState(1);
    const {lineIndex, setLLineIndex} = useState(0)

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

    return (
        <div className="slider-container">
            {showArrows && (
                <button className={`arrow left`} onClick={handlePrev}>
                    <IoIosArrowBack color='var(--orange-outline)' size={20} />
                </button>
            )}

            <Swiper
                className={isPadding ? 'swiper-padding' : 'swiper'}
                loop={loop}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    onSwiper(swiper); // ✅ Expose swiper to parent
                }}
                onSlideChange={(swiper) => {
                    // const newIndex = swiper.activeIndex;
                    const newIndex = swiper.realIndex;
                    setActiveIndex(newIndex); // ✅ internal dot management
                    if (onSlideChangeIndex) {
                        onSlideChangeIndex(newIndex); // ✅ notify parent for sync
                    }
                    if(onSlideChangeIndex) {
                        
                    }
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
                speed={500}
                breakpoints={breakpoints}
            >
                {slidesData.map((item, index) => (
                    <SwiperSlide key={index}>
                        {progressBarShow ? (
                            <div className="custom-slide-wrapper">
                                {renderSlide(item, index)}
                                <div
                                    className={`progress-bar ${activeIndex === index ? 'animate' : ''}`}
                                    style={{ animationDuration: `${delayTime}ms` }}
                                />
                            </div>
                        ) : (
                            renderSlide(item, index)
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            {showArrows && (
                <button className={`arrow right`} onClick={handleNext}>
                    <IoIosArrowForward size={20} color='var(--orange-outline)' />
                </button>
            )}

            {showDots && (
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

export default SwiperSlider