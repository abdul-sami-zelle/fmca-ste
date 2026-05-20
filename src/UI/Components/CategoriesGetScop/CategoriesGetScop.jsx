'use client'

import React from 'react';
import './CategoriesGetScop.css';
import Link from 'next/link';
import { url } from '../../../utils/api';

const CategoriesGetScop = ({ isTrue, text, contentImages }) => {

    

    return (
        <div className='scop-main-container'>

            <div className='scop-contact-container'>

                <div className='heading-and-links'>
                    <h3>Get The Scop</h3>
                    <span> <Link href={'#'}>Offer</Link> | <Link href={'#'}>Discounts</Link> | <Link href={'#'}>Best Prices</Link> </span>
                </div>

                <div className='scop-input'>
                    <div className='scop-input-email'>
                        <input type='text' placeholder='Email' />
                        <button>
                            <Link href={'#'}>Sign me up</Link>
                        </button>
                    </div>
                    <p>By Signing up, you agree to our Privacy Policy and Terms of use</p>
                </div>

            </div>

            <div className={`product-text-details ${isTrue ? 'show' : ''}`}>

                <div className='product-text'>

                    <div dangerouslySetInnerHTML={{ __html: text }} ></div>

                </div>

                <div className='image-gallery-slider'>

                    <div className='vertical-slider'>
                        <div className='img-one-container'>
                            {contentImages && contentImages.slice(0, 4).map((item, index) => (
                                <img key={index} className='img-one' src={`${url}${item.image_url}`} alt='img' />

                            ))}
                        </div>
                        <div className='img-two-container'>
                            {contentImages && contentImages.slice(4, 8).map((item, index) => (
                                <img key={index} className='img-two' src={`${url}${item.image_url}`} alt='img' />
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <div className={`mobile-view-get-scoop-text-and-slider ${isTrue ? 'show-mobile-content' : ''}`}>

                <div className='mobile-view-product-text-section-1'>
                    

                    <div className='product-text'>

                        <div dangerouslySetInnerHTML={{ __html: text }} ></div>

                    </div>

                </div>

                <div className='mobile-view-image-gallery-slider'>
                    <div className='mobile-view-vertical-slider'>
                        {contentImages && contentImages.slice(0, 4).map((item, index) => (
                            <img key={index} className='vertical-slider-one-images' src={`${url}${item.image_url}`} alt='vertical slider' />
                        ))}
                    </div>
                    <div className='mobile-view-vertical-slider'>
                        {contentImages && contentImages.slice(4, 8).map((item, index) => (
                            <img key={index} className='vertical-slider-one-images' src={`${url}${item.image_url}`} alt='vertical slider' />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CategoriesGetScop
