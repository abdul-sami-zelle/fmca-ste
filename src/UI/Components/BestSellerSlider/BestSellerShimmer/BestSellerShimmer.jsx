import React from 'react'
import './BestSellerShimmer.css';
import BestSellerProductCardShimmer from '../../BestSellerProductCard/BestSellerProductCardShimmer';

const BestSellerShimmer = ({rowDirection}) => {
  return (
    <>
      <div 
        className='best-seller-shimmer-main-container' 
        style={{ 
          flexDirection: rowDirection,
        }}>
        <div className='best-seller-cover-image-shimmer'></div>
        <div className='best-seller-products-main-container'>
          <div className='best-seller-product-head'>
            <div className='best-seller-main-heading'></div>
            <div className='best-seller-categories-container'>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className='best-seller-category-title-shimmer'></div>
              ))}
            </div>
          </div>
          <div className='best-seller-product-cards-shimmer-container'>
            {Array.from({ length: 6 }).map((_, index) => (
              <BestSellerProductCardShimmer key={index} />
            ))}
          </div>
        </div>
      </div>

      <div className='mobile-view-best-seller-shimmer'>
        <div className='mobile-view-best-seller-nav-container'>
          <div className='mobile-view-best-seller-nav-row'>
            <div className='mobile-view-nav-item'></div>
            <div className='mobile-view-nav-item'></div>
            <div className='mobile-view-nav-item'></div>
          </div>
        </div>
        <div className='mobile-view-best-seller-product-card-main-container'>
          <div className='mobile-view-best-seller-card'>
            <div className='mobile-view-best-seller-product-image'></div>
            <div className='mobile-view-product-name-shimmer'></div>
            <div className='mobile-view-product-rating'></div>
            <div className='mobile-view-product-shimmer-prices'>
              <div className='mobile-view-product-shimer-single-price'></div>
              <div className='mobile-view-product-shimer-single-price'></div>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}

export default BestSellerShimmer
