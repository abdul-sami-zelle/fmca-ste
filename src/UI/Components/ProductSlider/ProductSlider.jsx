import React, { useState, useRef } from 'react'
import './ProductSlider.css';
import ProductCard from './ProductCard/ProductCard';
import { url } from '../../../utils/api';
import { useSingleProductContext } from '../../../context/singleProductContext/singleProductContext';
import { useCart } from '../../../context/cartContext/cartContext';
import ProductSliderShimmer from './ProductSliderShimmer/ProductSliderShimmer';
import { useRouter } from 'next/navigation';
import { useProductPage } from '@/context/ProductPageContext/productPageContext';

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const ProductSlider = ({ cardData }) => {

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

  const router = useRouter();

  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const dragStart = (event) => {
    setIsDragging(true);
    setStartPos(getPositionX(event));
    if (sliderRef.current) {
      setScrollPos(sliderRef.current.scrollLeft);
      sliderRef.current.classList.add('dragging');
    }
  };

  const dragEnd = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.classList.remove('dragging');
    }
  };

  const drag = (event) => {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      const distance = currentPosition - startPos;
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = scrollPos - distance;
      }
    }
  };
  const { addSingleProduct } = useSingleProductContext();
  const {singleProductData, setSingleProductData} = useProductPage();
  const { addToCart } = useCart()

  const handleCardClicked = (item) => {
    // addSingleProduct(item)
    addSingleProduct(item)
    addToCart(item)
    router.push(`/product/${item.slug}`)
    setSingleProductData(item)
    // addQuantityIntoProduct(item.uid, setAllProducts, allProducts)

  }

  return (
    <>
      {cardData && cardData.length > 0 ? (
        <div className="products-slider-main-container">
          <h3 className='feature-product-heading'>Featured Products</h3>
          <div className='products-slider'
            ref={sliderRef}
            onMouseDown={dragStart}
            onMouseUp={dragEnd}
            onMouseLeave={dragEnd}
            onMouseMove={drag}
            onTouchStart={dragStart}
            onTouchEnd={dragEnd}
            onTouchMove={drag}
          >
            {cardData.map((item, index) => {
              return <ProductCard key={index}
                productData={item}
                img={url + item.images[1].image_url}
                heading={item.name}
                para={item.para}
                btnTxt={"Purchase Now"}
                productImageHeading={item.categories[0] !== undefined ? item.categories[0].name : ""}
                productImagePrice={"$" + item.sale_price}
                productImageAbout={""}
                productLink={""}
                index={index}
                handleCardClicked={() => handleCardClicked(item)}
              />
            })}
          </div>
        </div>
      ) : (
        <ProductSliderShimmer />
      )}
    </>

  );
};

export default ProductSlider;

