import React, { useEffect, useState } from 'react';
import './TrendingNow.css';
import { url } from '../../../utils/api';
import TrandingNowShmmer from './TrandingNowShimmer/TrandingNowShmmer';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidShoppingBag } from "react-icons/bi";
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';


const TrendingNow = ({ data }) => {
    

    const productArray = data ? Object.keys(data)
        .filter(key => key.startsWith('product_'))
        .map(key => data[key]) : [];

    return (
        <>
            {data ? (
                <div className='trending-now-main-container'>
                    <h3>Trending Now</h3>
                    <div className='tranding-slider-and-categories'>
                        <div className="tranding-slider">
                            <div className="tranding-slides">

                                <SwiperSlider
                                    slidesData={data?.sliders}
                                    renderSlide={(image, index) => (
                                        <Link href={`/product/${image.link_url}`} className="trending-slide" key={index}>
                                            <Image
                                                src={`${url}${image.image_url}`}
                                                width={1160}
                                                height={730}
                                                alt={`Slide ${index + 1}`}
                                            />


                                        </Link>
                                    )}
                                    showDots={false}
                                    showArrows={false}
                                    spaceBetween={20}
                                    loop={true}
                                    delayTime={5000}
                                    autoplay={true}
                                    slidesPerView={1}
                                />
                                <div className='tranding-cart-overlay-main-container'>
                                    <div className='tranding-card-bag-container'>
                                        <BiSolidShoppingBag size={30} className='tranding-now-cart-bag' />
                                        <BiSolidShoppingBag size={20} className='mobile-tranding-now-cart-bag' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='trending-items-cards'>
                            {productArray.map((item, index) => (
                                <Link href={`/product/${item.link_url}`} key={item.uid || `product-${index}`} className='trending-item-category'>
                                    <Image
                                        src={`${url}${item.image_url}`}
                                        width={300}
                                        height={240}
                                        alt={item.alt_text}
                                        effect='blur'
                                    />
                                    <div className='small-tranding-cart-overlay-main-container'>
                                        <div className='small-tranding-card-bag-container'>
                                            <BiSolidShoppingBag size={15} className='mobile-tranding-now-cart-bag' />
                                            <BiSolidShoppingBag size={15} className='tranding-now-cart-bag' />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <TrandingNowShmmer />
            )}
        </>
    );
};

export default TrendingNow;