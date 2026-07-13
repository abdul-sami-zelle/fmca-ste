import React from 'react'
import './BestSellerProductCard.css';
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { useList } from '../../../context/wishListContext/wishListContext';
import RatingReview from '../starRating/starRating';
import { formatedPrice, url } from '../../../utils/api';
import Link from 'next/link';
import Image from 'next/image';

const BestSellerProductCard = (
    {
        productMainImage,
        handleWishListClicked,
        productData,
        productName,
        oldPrice,
        newPrice,
    }) => {

    // States and Variables
    const { isInWishList } = useList()

    // Functions





    return (
        <Link
            className='category-product-card'
            href={{ pathname: `/product/${productData.slug}`, state: productData }}
        >
            <div className='category-product-image'>
                <Image src={`${url}${productMainImage}`} width={340} height={210} alt='product' effect='blur' />
            </div>
            <div className='category-containt-section'>
                <div className='category-product-rating-and-name'>
                    <div className='category-product-name'>
                        <h3>{productName}</h3>
                    </div>
                </div>
                <div className='best-seller-rating-and-review'>
                    <RatingReview rating={productData?.average_rating} disabled={true} size={"12px"} />
                    <p>({productData?.rating_count})</p>
                </div>

                <div className='category-product-price-and-heart'>
                    {newPrice !== '' ? (
                        <div className='category-product-price'>
                            <p>{formatedPrice(newPrice)}</p>
                            <del>{formatedPrice(oldPrice)}</del>
                        </div>
                    ) : (
                        <div className='category-product-price'>
                            <p>{formatedPrice(oldPrice)}</p>
                        </div>
                    )}

                    {
                        isInWishList(productData?._id) ? (
                            <VscHeartFilled
                                size={25}
                                style={{ color: 'var(--orange-fill)' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleWishListClicked(productData);
                                }}
                            />
                        ) : (
                            <VscHeart
                                size={25}
                                style={{ color: 'var(--orange-fill)' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleWishListClicked(productData);
                                }}
                            />
                        )
                    }
                    {/* {
                        isInWishList(productData.uid) ? <VscHeartFilled
                            size={25}
                            style={{ color: 'var(--orange-fill)' }}
                            onClick={(e) => { e.stopPropagation(); handleWishListClicked(productData) }} />
                            : <img src={'/Assets/icons/like.png'}
                                alt='heart'
                                className='hide-on-mobile'
                                onClick={(e) => { e.stopPropagation(); handleWishListClicked(productData) }} />
                    } */}
                </div>
            </div>
        </Link>
    )
}

export default BestSellerProductCard
