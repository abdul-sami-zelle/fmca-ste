import React, { use, useEffect, useState } from 'react'
import './ProductReviewTab.css'
import WriteReview from '../../../WriteReview/WriteReview'
import RatingAndReview from '../../../RatingAndReview/RatingAndReview'
import axios from 'axios'
import { url } from '../../../../../utils/api'
// import { useLocation, useParams } from 'react-router-dom'
import ProductComments from '../../../ProductComments/ProductComments'
import SnakBar from '../../../../../Global-Components/SnakeBar/SnakBar'
import useSWR from 'swr'
import { fetcher } from '@/utils/Fetcher'

const ProductReviewTab = ({ id, reviewRef, productData, params }) => {

  const { slug } = use(params);
  // const location = useLocation();
  const [product, setProduct] = useState(productData || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('')
  const [snakebarOpen, setSnakebarOpen] = useState(false);

  const handleOpenSnakeBar = (message) => {
    setSnakebarOpen(true);
    setErrorMessage(message)
  }

  const handleCloseSnakeBar = () => {
    setSnakebarOpen(false);
  }

  const slugProductsApi = slug ? `${url}/api/v1/products/get-by-slug/${slug}` : null
  const [slugProductCount, setSlugProductCount] = useState(0);

  const {date: slugProducts, error: slugErrors, isLoading: slugLoading} = useSWR(slugProductsApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60
  })

  if(slugErrors && slugProductCount < 3 ) {
    setTimeout(() => {
      setSlugProductCount(slugProductCount + 1);
    }, 1000)
  }

  useEffect(() => {
    if(slugProducts) {
      const fetchedProduct = slugProducts.products[0] || {};
      setProduct(fetchedProduct);
    }
  }, [slugProducts])


  const reviewsApi = product?.uid ? `${url}/api/v1/reviews/get-by-product/${product?.uid}` : null
  const [reviewFuncCount, setReviewCount] = useState(0);
  const {data: reviewData, error: reviewError, isLoading: reviewLoading} = useSWR(reviewsApi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60
  })

  if(reviewError && reviewFuncCount < 3) {
    setTimeout(() => {
      setReviewCount;
    }, 1000)
  }

  useEffect(() => {
    if(reviewData) {
      setReviews(reviewData.reviews);
    }
  }, [reviewData])


  return (
    <div
    className='reviews'
      id={'Reviews'}
      ref={reviewRef}
    >
      <RatingAndReview rating={product?.average_rating} data={reviews} reviews={reviews} loading={loading} error={error} />
      {loading && <div>Loading reviews...</div>}
      {error && <div>{error}</div>}

      <WriteReview productData={product} snakeBarOpen={handleOpenSnakeBar} product_id={product?.uid} review_enable={product?.enable_review} product_name={product?.name} product_permalink={"https://"} />
      <ProductComments review_enable={product?.enable_review} data={reviews} />

      <SnakBar
        message={errorMessage}
        openSnakeBarProp={snakebarOpen}
        setOpenSnakeBar={setSnakebarOpen}
        onClick={handleCloseSnakeBar}
      />
    </div>
  )
}

export default ProductReviewTab
