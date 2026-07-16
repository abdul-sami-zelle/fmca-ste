"use client"

import React, { useRef, useEffect, useState } from 'react';
import './style.css';
import ReviewCard from '../ReviewCards/ReviewCard';
import ReviewCardShimmer from '../ReviewCards/ReviewShimmerCard';

const MOBILE_BREAKPOINT = 768;
const SHIMMER_COUNT = 4; // how many shimmer cards to show while loading

const ReviewsSlider = ({ reviews, isLoading = false, speed = 40, brakeMs = 600, accelMs = 800 }) => {
    const trackRef = useRef(null);
    const wrapperRef = useRef(null);
    const [copyWidth, setCopyWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const posRef = useRef(0);
    const velRef = useRef(0);
    const targetVelRef = useRef(speed);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const hasCenteredRef = useRef(false); // has mobile scroll been centered yet

    // Still loading, or no reviews at all yet — show shimmer instead of
    // bailing out entirely (so the heading + wrapper stay in place).
    const showShimmer = isLoading || !reviews || reviews.length === 0;

    // Desktop uses 2 copies (for the transform-loop wrap point).
    // Mobile uses 3 copies so there's always a buffer copy to scroll into
    // on either side, which is what makes the infinite illusion work.
    const copiesCount = isMobile ? 3 : 2;

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, []);

    // Measure one copy's width (needed on both desktop and mobile now).
    // Skipped while shimmering — nothing to measure/scroll yet.
    useEffect(() => {
        if (showShimmer) return;
        const measure = () => {
            if (trackRef.current) {
                setCopyWidth(trackRef.current.scrollWidth / copiesCount);
            }
        };
        measure();
        const resizeObserver = new ResizeObserver(measure);
        if (trackRef.current) resizeObserver.observe(trackRef.current);
        window.addEventListener('resize', measure);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [reviews, copiesCount, showShimmer]);

    // Auto-scroll animation loop — desktop only.
    useEffect(() => {
        if (isMobile || !copyWidth || showShimmer) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return;

        const tick = (time) => {
            if (lastTimeRef.current == null) lastTimeRef.current = time;
            const dt = (time - lastTimeRef.current) / 1000;
            lastTimeRef.current = time;

            const isBraking = targetVelRef.current < velRef.current;
            const rampMs = isBraking ? brakeMs : accelMs;
            const rate = rampMs > 0 ? dt / (rampMs / 1000) : 1;
            velRef.current += (targetVelRef.current - velRef.current) * Math.min(rate, 1);

            posRef.current += velRef.current * dt;
            if (posRef.current >= copyWidth) {
                posRef.current -= copyWidth;
            }

            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(${-posRef.current}px)`;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            lastTimeRef.current = null;
            posRef.current = 0;
            velRef.current = 0;
        };
    }, [copyWidth, brakeMs, accelMs, isMobile, showShimmer]);

    // Reset transform when entering mobile mode — mobile drives position
    // via native scrollLeft, not a CSS transform.
    useEffect(() => {
        if (isMobile && trackRef.current) {
            trackRef.current.style.transform = 'none';
        }
        if (!isMobile) {
            hasCenteredRef.current = false;
        }
    }, [isMobile]);

    // Center the scroll position on the middle copy once, so the user can
    // immediately drag either left or right and still be "inside" content.
    useEffect(() => {
        if (!isMobile || !copyWidth || !wrapperRef.current || hasCenteredRef.current || showShimmer) return;
        wrapperRef.current.scrollLeft = copyWidth;
        hasCenteredRef.current = true;
    }, [isMobile, copyWidth, showShimmer]);

    // The infinite-loop illusion: whenever the drag crosses into the first
    // or third copy, jump scrollLeft back by exactly one copy-width. Since
    // all copies are identical, the jump is visually seamless.
    useEffect(() => {
        if (!isMobile || showShimmer) return;
        const el = wrapperRef.current;
        if (!el) return;

        const onScroll = () => {
            if (!copyWidth) return;
            const { scrollLeft } = el;
            if (scrollLeft <= 0) {
                el.scrollLeft = scrollLeft + copyWidth;
            } else if (scrollLeft >= copyWidth * 2) {
                el.scrollLeft = scrollLeft - copyWidth;
            }
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [isMobile, copyWidth, showShimmer]);

    const handleEnter = () => {
        if (!isMobile) targetVelRef.current = 0;
    };
    const handleLeave = () => {
        if (!isMobile) targetVelRef.current = speed;
    };

    return (
        <div className="what-customer-says">
            <h3 className="what-cust-says-heading">What Customers Say</h3>

            <div
                className={`reviews-slider-wcs${isMobile ? ' is-mobile' : ''}`}
                ref={wrapperRef}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
            >
                {showShimmer ? (
                    <div className="reviews-slider-track">
                        {Array.from({ length: SHIMMER_COUNT }).map((_, index) => (
                            <div className="reviews-slider-item" key={`shimmer-${index}`}>
                                <ReviewCardShimmer />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="reviews-slider-track" ref={trackRef}>
                        {Array.from({ length: copiesCount }).map((_, copyIndex) =>
                            reviews.map((reviewData, index) => (
                                <div
                                    className="reviews-slider-item"
                                    key={`c${copyIndex}-${index}`}
                                    aria-hidden={copyIndex > 0 ? true : undefined}
                                >
                                    <ReviewCard reviewData={reviewData} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsSlider;