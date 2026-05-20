import React from 'react'
import './ProductRecommendationTab.css'
import SimillerProducts from '../../../SimillerProducts/SimillerProducts'
import FrequentlyBought from '../../../FrequentlyBought/FrequentlyBought'

const ProductRecommendationTab = ({id, recommendationRef, product}) => {
  return (
    <div
      id={'Recommendations'}
      ref={recommendationRef}
      className='product-recommendation-main-container'
    >
      <SimillerProducts isPadding={false} productId={product.uid} collection={product?.collection} />
      <FrequentlyBought isPadding={false} product={product} relatedProducts={product?.related_products} />
    </div>
  )
}

export default ProductRecommendationTab
