import React, { useState } from 'react'
import './ProductDescriptionTab.css'
import { url } from '../../../../../utils/api'
import Image from 'next/image'

const ProductDescriptionTab = ({ id, descriptionRef, productData, addMarginTop ,}) => {


  return (
    <div
      id={'Description'}
      ref={descriptionRef}
      className={`product-description-main-container ${addMarginTop ? 'add-top-margin' : ''}`}
    >
      <h3>Description</h3>
      <div className='product-description-section'>
        <div className='product-description-image-container'>
          {productData?.image?.image_url && (
            <Image src={productData.outSource === true ? productData.image.image_url : `${url}${productData?.image?.image_url}`} width={320} height={160} alt='product' />
          )}
        </div>
        <div className='product-description'>
          
          <div dangerouslySetInnerHTML={{ __html: productData?.description }} ></div>
        </div>
      </div>

      {/* {productData?.product_features?.length > 0 && <div className='product-features-main-container'>
        <h3>Features</h3>
        <div className='product-features-and-extra-features-container'>
          <div className='product-features-section'>
            {productData?.product_features?.map((item, index) => (
              <div 
                key={index}
                className='product-single-feature'
              >
                
                <img src={url+item.image} alt='icon' />
                <div className='product-single-feature-title-and-desc'>
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>} */}

    </div>
  )
}

export default ProductDescriptionTab