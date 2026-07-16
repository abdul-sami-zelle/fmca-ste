import React, { useState } from 'react'
import './LatestModulerBanner.css';
// import fullBed from '../../../Assets/to-be-change/hp-fourth_hero_mat_desktop_1b_3200x1388.png';
// import loader from "../../../Assets/Loader-animations/loader-check-two.gif"
import { url } from '../../../utils/api';
import Image from 'next/image';

const LatestModulerBanner = ({ images, mobileMainImage, customWidth, mainImage, width= '100%', mainImgShow, showBanners, paddingTop }) => {
  const [imagePreloader, setImagePreloader] = useState(false);

  return (
    <>
      <div className={`moduler-container ${customWidth ? 'show' : ''}`}>

        <div className={`financing-banner`}>
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/download 51.png"} alt="paypal banner" />
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/Well-Fargo-Financing-1 1.png"} alt="paypal banner two" />
        </div>

        <div className='mobile-view-financing-banner'>
          <img src={"/Assets/images/Group 382.png"} alt="paypal" />
        </div>

        <div className='installment-banner'>
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/New Main Financing.jpg"} alt="instalment-plan banner" />
        </div>

        <div className='mobile-view-bed-banner'>
          <img src={"/Assets/images/Rectangle 703.png"} alt="full bed" />
        </div>

      </div>

      <div className={`full-width-container ${customWidth ? 'hide' : ''}`}>
        
        <div className={`dining-image-div ${mainImgShow ? 'show-main-img' : ''}`}>
          {mainImage !== undefined ? (
            <Image src={url+mainImage} width={1580} height={360} alt='dining ' className='desktop-main-banner' />
            ) : (
              <div className='category-main-banner-shimmer'></div>
            )}
          {mobileMainImage !== undefined ? (
            <img  src={url+mobileMainImage} alt='mobile-main-image' className='mobile-main-banner' />
          ) : (
            <div className='mobile-view-main-banner-shimmer'></div>
          )}
          

          {/* {!imagePreloader && <div className='image_preloader'>
            <img src={'/Assets/Loader-animations/loader-check-two.gif'} alt="" />
          </div>} */}
        </div>

        <div className={`dining-paypal-div ${showBanners ? 'show-banners' : ''} ${paddingTop ? 'padding-top' : ''}`}>
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/download 51.png"} alt='paypal one' />
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/Well-Fargo-Financing-1 1.png"} alt='paypal two' />
        </div>

        <div className={`dining-installment-div ${showBanners ? 'show-banners' : ''}`}>
          <img src={"/Assets/Furniture Mecca/Landing Page/Pay option banner/New Main Financing.jpg"} alt='installment' />
        </div>

      </div>
    </>
  )
}

export default LatestModulerBanner
