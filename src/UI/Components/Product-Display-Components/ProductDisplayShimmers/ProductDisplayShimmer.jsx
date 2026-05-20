import React from 'react'
import './ProductDisplayShimmer.css'

const ProductDisplayShimmer = () => {
    return (
        <>
            <div className='product-display-shimmer-main-contianer'>
                <div className='product-display-slider-and-gallery-shimmer-section'>
                    <div className='product-display-slider-shimmer-sec'>
                        <div className='display-product-sliderthumbnail-shimmer-sec'></div>
                        <div className='display-product-slider-main-image-shimmer-sec'></div>
                    </div>
                    <div className='product-display-gallery-sec'>
                        <div className='product-display-gallery-single-col-shimmer'></div>
                        <div className='product-display-gallery-single-col-shimmer'></div>
                    </div>
                </div>
                <div className='product-display-details-shimmer-section'>
                    <div className='product-name-and-rating-section'>
                        <div className='product-tag-shimmer'></div>
                        <div className='product-name-shimmer'></div>
                        <div className='product-sku-shimmer'></div>
                        <div className='product-rating-shimmer'></div>
                        <div className='product-price-shimmer'></div>
                    </div>

                    <div className='product-display-variations-and-add-to-cart'>
                        <div className='product-sidplay-variations'>
                            <div className='color-name-shimmer'></div>
                            <div className='color-box-shimmer'></div>
                            <div className='type-name-shimmer'></div>
                            <div className='type-box-shimmer'></div>
                        </div>
                        <div className='product-display-add-to-cart'>
                            <div className='product-inc-des-shimmer'></div>
                            <div className='product-wishlist-shimmer'></div>
                            <div className='product-add-to-cart-shimmer'></div>
                        </div>
                    </div>

                    <div className='might-also-need-shimmer'>
                        <div className='might-also-need-shimmer-heading'></div>
                        <div className='might-also-need-shimmer-card'></div>
                    </div>
                </div>
            </div>

            <div className='product-display-mobile-shimmer'>
                <div className='mobile-product-sidplay-tag-shimmer'></div>
                <div className='mobile-product-sidplay-name-shimmer'></div>
                <div className='mobile-product-sidplay-sku-shimmer'></div>
                <div className='mobile-product-sidplay-price-shimmer'></div>
                <div className='mobile-product-sidplay-rating-shimmer'></div>
                <div className='mobile-product-sidplay-image-shimmer'></div>
                <div className='mobile-product-sidplay-gallery-shimmer-section'>
                    <div className='mobile-shimmer-gallry-single-sec-shimmer'></div>
                    <div className='mobile-shimmer-gallry-single-sec-shimmer'></div>
                </div>
                
            </div>
        </>
    )
}

export default ProductDisplayShimmer