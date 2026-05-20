import React from 'react';
import './ProductCard.css';
import arrowLeft from '../../../../Assets/icons/arrow-left-black.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Link from 'next/link';
import Image from 'next/image';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const ProductCard = ({
  productData,
  handleCardClicked,
  img,
  heading,
  para,
  btnTxt,
  productImageHeading,
  productImagePrice,
  productImageAbout,
  productLink,
  onImageDrage,
  index,
}) => {
  // const backgroundColor = index % 2 === 0 ? '#F29039' : '#CC433B';

  return (
    <div className="product" >
      <div className="product-img">
        <Image
          src={img}
          width={720}
          height={450}
          alt="product"
          // onClick={(e) => {handleCardClicked(productData)}}
          onDragStart={(e) => e.preventDefault()} 
        />
        <div className="product-img-detail">
          <div
            // style={{ backgroundColor }}
            className="top_rated_head"
          >
            {/* TOP RATED */}
            Featured
          </div>
          <div className="top_rated_price_cont">
            <p>Starting From</p>
            <h3>{productImagePrice}</h3>
          </div>
        </div>
      </div>
      <div className="product-details">
        <Link
          className='product-detail-heading'
          href={{ pathname: `/product/${productData?.slug}`, state: productData }}
        >
          {heading}
        </Link>
        {/* <Link 
          className='product-detail-btn'
          href={{ pathname: `/product/${productData?.slug}`, state: productData }}
        >
          <div>{btnTxt}</div>
          <MdKeyboardArrowRight size={20} className='featured-product-button-arrow' />
        </Link> */}
      </div>
    </div>
  );
};

export default ProductCard;
