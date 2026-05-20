import React from 'react'
import './MobileFinancingSlider.css'
import { url } from '../../../utils/api';
import Image from 'next/image';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import Link from 'next/link';

const MobileFinancingSlider = ({ images, borderTop = '0px' }) => {

    return (
        <div className="mobile-carousel-container" style={{borderTop: borderTop}}>
            <SwiperSlider
                slidesData={images?.mobile}
                renderSlide={(image, index) => (
                    <Link href={'./financing'} className="mobile-carousel-slide" key={index}>
                        <Image
                            src={`${url}${image.image_url}`}
                            alt={`slide ${index + 1}`}
                            width={480}
                            height={220}
                        />
                    </Link>
                )}
                showDots={false}
                showArrows={false}
                spaceBetween={20}
                autoplay={false}
                loop={true}
                delayTime={3000}
                slidesPerView={1}
            />
        </div>
    )
}

export default MobileFinancingSlider
