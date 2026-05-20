import React, {useState} from 'react';
import './DealOfTheDayCard.css';
import heartIcon from '../../../../Assets/icons/heart-charcol.png';
import { url } from '../../../../utils/api';
import { useList } from '../../../../context/wishListContext/wishListContext';
import RatingReview from '../../starRating/starRating';
import { LiaShoppingBagSolid } from "react-icons/lia";
import { RiShareBoxLine } from "react-icons/ri";
import { IoMdHeartEmpty } from "react-icons/io";
import Image from 'next/image';


const DealOfTheDayCard = ({
    index, 
    name, 
    rating, 
    review, 
    price, 
    newPrice, 
    isDiscountable,
    productImage, 
    handleDealCardClick, 
    dealDayData,
    handleWishListClick,
    handleCartSection,
    handleShareProduct,
    dicountPercent
  }) => {

    
    const formatePrice = (price) => {
      return new Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD'
      }).format(price)
    }
    
    const {isInWishList} = useList()
    return (
      <div 
        index={index} 
        className='deal-of-the-day-product-card' 
        onClick={() => handleDealCardClick(dealDayData)}
      >
        <div 
            className='deal-of-the-day-product-rating-and-name'
          >
          <h3 className='deal-of-the-day-product-name'>
            {name}
          </h3>
          <div 
            className='deal-of-the-day-price'
          >
            <p>{parseInt(newPrice) === 0 || newPrice === '' ? formatePrice(price) : formatePrice(newPrice)}</p>
            {isDiscountable ? <del>{formatePrice(price)}</del> : <></>}
              
          </div>
          <div 
              className='deal-of-the-day-rating-and-reviews'>
            <div 
                className='deal-of-the-day-card-stars'>
            
              <RatingReview  size={"12px"} rating={rating} />
              </div>
            {/* <p>({review})</p> */}
          </div>
        </div>

        <div className='deal-of-the-day-product-image'>
          <Image src={heartIcon} width={20} height={20} alt='heart-icon' className='mobile-view-deal-day-card-heart-icon' />
          <div className='deal-of-the-day-product-discount'><p>{dicountPercent}</p></div>
          <Image src={`${url}${productImage}`} width={400} height={250} alt='img' effect='blur' />
          <div className='deal-of-the-day-card-icons-div'>
              <button 
                  className={`deal-of-the-day-icon-one`}
                  onClick={(e) => {e.stopPropagation(); handleCartSection(dealDayData)}} 
              > 
                <LiaShoppingBagSolid className='deal-of-month-cart-icon' color='var(--text-gray)' size={20}/>
              </button>
            
              <button  
                  className={`deal-of-the-day-icon-two ${isInWishList(dealDayData._id) ? 'active-wish-list-btn' : ''}`}
                  onClick={(e) => {e.stopPropagation(); handleWishListClick(dealDayData)}} 
              >
                <IoMdHeartEmpty className='deal-of-month-heart-icon' size={20} color='var--text-gray' />
              </button>

              <button 
                  className={`deal-of-the-day-icon-three `} 
                  onClick={(e) => {e.stopPropagation() ; handleShareProduct(dealDayData)}}
              >
                <RiShareBoxLine className='deal-of-month-share-icon' color='var(--text-gray)' size={20} />
              </button>
          </div> 
        </div>

        <div className='mobile-view-deal-of-the-day-product-details'>
            <div className='mobile-view-star-rating-and-review'>
                <div className='mobile-view-product-stars'>
                <RatingReview  size={"12px"} rating={rating} />
                </div>
            </div>
            <h3 className='mobile-view-deal-of-the-day-product-name'>
                {name}
            </h3>
          
            <div 
            className='mobile-view-deal-of-the-day-price'>
              <p>{parseInt(newPrice) === 0 || newPrice === '' ? formatePrice(price) : formatePrice(newPrice)}</p>
              {isDiscountable ? <del>{formatePrice(price)}</del> : <></>}
          </div>
        </div>
      </div>
    );
};

export default DealOfTheDayCard;
