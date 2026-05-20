import React from 'react'
import './ProductDetailTab.css'
import { url } from '../../../../../utils/api';

const ProductDetailTab = ({id, detailsRef, productData, productDetails}) => {

  return (
    <div
        id={'Details'}
        ref={detailsRef}
        className='product-detail-main-section'
    >
      <h3>Product Details</h3>
      <div className="product-details-sub-section">
      <div className='product-detail-left-section'>
        {productData?.dimension_image?.image_url && (
          <img src={`${url}${productData?.dimension_image?.image_url}`} alt='dimension' />
        ) }
        {/* // : (
        //     <img src={`${url}${productData?.image?.image_url}`} alt='detail' />
        // )} */}
        
      </div>
      <div className='product-detail-right-section'>

        <div className='product-detail-right-section-items product-detail-second-tab'>
          <span>
            <h3>Collection:</h3>
            <p>{productDetails?.collection}</p>
          </span>
          {/* <p>More Dimensions</p> */}
        </div>

        <div className='product-detail-right-section-items'>
          <span>
            <h3>Color:</h3>
            <p>{productDetails?.color}</p>
          </span>
          {/* <p>Care Instructions</p> */}
        </div>

        <div className='product-detail-right-section-items product-detail-second-tab'>
        <span>
            <h3>Brand:</h3>
            <p>{productDetails?.brand}</p>
          </span>
        </div>

        <div className='product-detail-right-section-items'>
          <span>
            <h3>Category:</h3>
            <p>{productDetails?.category}</p>
          </span>
        </div>

        <div className='product-detail-right-section-items product-detail-second-tab'>
        <span>
            <h3>Stock:</h3>
            <p> {productDetails?.stock} </p>
          </span>
        </div>
        <div className='product-detail-right-section-items'>
          <span>
            <h3>MPN:</h3>
            <p>{productDetails?.mpn}</p>
          </span>
        </div>
        <div className='product-detail-right-section-items product-detail-second-tab'>
        <span>
            <h3>GTIN:</h3>
            <p> {productDetails?.gtin} </p>
          </span>
        </div>
        <div className='product-detail-right-section-items'>
          <span>
            <h3>Protection Plan:</h3>
            <p>{productDetails?.protection}</p>
          </span>
        </div>
      </div>
      </div>
      
    </div>
  )
}

export default ProductDetailTab
