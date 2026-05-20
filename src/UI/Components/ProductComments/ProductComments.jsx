import React from 'react'
import './ProductComments.css';
import SearchReviews from '../SearchReviews/SearchReviews';
import ProductCommentsSection from '../ProductCommentsSection/ProductCommentsSection';

const ProductComments = ({data, review_enable}) => {
  return (
    <div className={`customer-comments-main-container ${review_enable === 1 ? 'show-customer-comments-main-container' : ''}`}>
        {/* <SearchReviews /> */}
        <ProductCommentsSection data={data} />
    </div>
  )
}

export default ProductComments
