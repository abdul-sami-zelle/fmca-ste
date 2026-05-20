import React from "react";
import './GridSlider.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

const GridSlider = ({ slidesData = [], renderSlide }) => {
  return (
    <div className="slider-container">
      <Swiper
        slidesPerView={3}              // ✅ 3 per row
        grid={{
          rows: 2,                     // ✅ 2 rows
          fill: "row",                 // ✅ ensures filling row-wise
        }}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Grid, Pagination]}
        className="mySwiper"
      >
        {slidesData.map((item, index) => (
          <SwiperSlide key={index}>
            {renderSlide(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GridSlider;
