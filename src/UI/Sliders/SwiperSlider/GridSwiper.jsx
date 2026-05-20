import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SwiperSlider.css';

const CustomGridSwiper = ({
  data = [],
  renderItem,
  arrow = false,
  dot = false,
  className = '',
}) => {
  // Break data into groups of 6 items (2 rows * 3 columns)
  const chunkedData = [];
  for (let i = 0; i < data.length; i += 6) {
    chunkedData.push(data.slice(i, i + 6));
  }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={0}
      navigation={arrow}
      pagination={dot ? { clickable: true } : false}
      modules={[...(arrow ? [Navigation] : []), ...(dot ? [Pagination] : [])]}
      className={`custom-grid-swiper ${className}`}
    >
      {chunkedData.map((group, pageIndex) => (
        <SwiperSlide key={pageIndex}>
          <div className="grid-page">
            {group.map((item, i) => (
              <div key={i} className="grid-card">
                {renderItem(item)}
              </div>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CustomGridSwiper;
