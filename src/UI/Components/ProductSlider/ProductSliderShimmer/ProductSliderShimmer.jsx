import React from 'react'
import './ProductSliderShimmer.css';

const ProductSliderShimmer = () => {
  return (
    <>
      <div className='feature-products-main-container-shimmer'>
        <div className='feature-product-main-heading-shimmer'></div>
        <div className='feature-product-cards-shimmer'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='feature-product-card-shimmer'>
              <div className='feature-card-product-image-shimmer'></div>
              <div className='feature-product-title-shimmer'></div>
              <div className='feature-product-button-shimmer'></div>
            </div>
          ))}
        </div>
      </div>
    </>

  )
}

export default ProductSliderShimmer
